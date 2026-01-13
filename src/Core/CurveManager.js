import { palettes, fidenzaScales } from '../Config/Constants.js';

export class CurveManager {
    constructor(p, flowField, settings) {
        this.p = p;
        this.flowField = flowField;
        this.settings = settings;
        this.occupancyGrid = [];
        this.occRes = 1;
        this.curves = [];
        this.renderedCount = 0;
    }

    init() {
        const occCols = Math.ceil(this.p.width / this.occRes);
        const occRows = Math.ceil(this.p.height / this.occRes);
        this.occupancyGrid = new Array(occCols);
        for (let x = 0; x < occCols; x++) {
            this.occupancyGrid[x] = new Uint32Array(occRows).fill(0);
        }
        this.curves = [];
        this.renderedCount = 0;
        this.generateCurves();
    }

    render() {
        const p = this.p;
        const settings = this.settings;

        p.noFill();

        // Pass 1: Shadows (if not animating, or at start)
        if (settings.shadows) {
            p.push();
            for (const curve of this.curves) {
                this.renderCurveShadow(curve);
            }
            p.pop();
        }

        // Pass 2: Main Curves
        for (const curve of this.curves) {
            this.renderWithSymmetry(curve, (c) => this.renderSingleCurve(c));
        }
        this.renderedCount = this.curves.length;
    }

    renderNextBatch(batchSize) {
        if (this.renderedCount >= this.curves.length) return false;

        const p = this.p;
        const settings = this.settings;
        p.noFill();

        const end = Math.min(this.renderedCount + batchSize, this.curves.length);

        // Shadows for this batch
        if (settings.shadows) {
            p.push();
            for (let i = this.renderedCount; i < end; i++) {
                this.renderWithSymmetry(this.curves[i], (c) => this.renderCurveShadow(c));
            }
            p.pop();
        }

        // Curves for this batch
        for (let i = this.renderedCount; i < end; i++) {
            this.renderWithSymmetry(this.curves[i], (c) => this.renderSingleCurve(c));
        }

        this.renderedCount = end;
        return true;
    }

    renderSingleCurve(curve) {
        const settings = this.settings;
        if (settings.watercolor) {
            this.renderCurveWatercolor(curve);
        } else if (settings.grainMode === 'sketched') {
            this.renderCurveSketched(curve);
        } else {
            this.renderCurveStandard(curve);
        }
    }

    generateCurves() {
        const p = this.p;
        const settings = this.settings;

        if (settings.startingMode === 'circlePacking') {
            const maxAttempts = 1000;
            let curvesPlaced = 0;
            for (let i = 0; i < settings.numCurves; i++) {
                for (let attempt = 0; attempt < maxAttempts; attempt++) {
                    const x = p.random(p.width);
                    const y = p.random(p.height);

                    let occX = Math.floor(x / this.occRes);
                    let occY = Math.floor(y / this.occRes);

                    if (occX >= 0 && occX < this.occupancyGrid.length && occY >= 0 && occY < this.occupancyGrid[0].length) {
                        if (this.occupancyGrid[occX][occY] === 0) {
                            const curve = this.createCurve(x, y, curvesPlaced + 1);
                            if (curve.points.length > 1) {
                                this.curves.push(curve);
                                curvesPlaced++;
                                break;
                            }
                        }
                    }
                }
            }
        } else if (settings.startingMode === 'grid') {
            const spacing = Math.sqrt((p.width * p.height) / settings.numCurves);
            let id = 1;
            for (let x = 0; x < p.width; x += spacing) {
                for (let y = 0; y < p.height; y += spacing) {
                    const curve = this.createCurve(x, y, id++);
                    if (curve.points.length > 1) this.curves.push(curve);
                }
            }
        } else {
            for (let i = 0; i < settings.numCurves; i++) {
                const curve = this.createCurve(p.random(p.width), p.random(p.height), i + 1);
                if (curve.points.length > 1) this.curves.push(curve);
            }
        }
    }

    createCurve(startX, startY, curveID) {
        const p = this.p;
        const settings = this.settings;

        let baseWeight = settings.strokeWeight;
        if (settings.thicknessMode === 'fidenza') {
            const bins = fidenzaScales[settings.fidenzaScale];
            let r = p.random();
            let cumulative = 0;
            let selectedBin = bins[0];
            for (const bin of bins) {
                cumulative += bin.weight;
                if (r < cumulative) {
                    selectedBin = bin;
                    break;
                }
            }
            baseWeight = p.random(selectedBin.min, selectedBin.max);
        } else if (settings.thicknessMode === 'random') {
            baseWeight = p.random(settings.minThickness, settings.maxThickness);
        } else if (settings.thicknessMode === 'noise') {
            let n = this.flowField.fBm(startX * 0.005, startY * 0.005);
            baseWeight = p.map(n, -1, 1, settings.minThickness, settings.maxThickness);
        }

        let strokeCol;
        if (settings.colorMode === 'palette') {
            const palette = palettes[settings.selectedPalette];
            let r = p.random();
            let cumulative = 0;
            let chosenColor = palette[0].color;
            for (const entry of palette) {
                cumulative += entry.weight;
                if (r < cumulative) {
                    chosenColor = entry.color;
                    break;
                }
            }
            strokeCol = p.color(chosenColor[0], chosenColor[1], chosenColor[2], settings.opacity);
        } else if (settings.colorMode === 'white') {
            if (settings.paperTheme) {
                strokeCol = p.color(40, 40, 40, settings.opacity);
            } else {
                strokeCol = p.color(255, settings.opacity);
            }
        } else {
            strokeCol = p.color(255, settings.opacity);
        }

        const points = [];
        // Grow in both directions and merge
        const forward = this.getPoints(startX, startY, 1, baseWeight, curveID);
        const backward = this.getPoints(startX, startY, -1, baseWeight, curveID);

        // Merge: backward (reversed) + forward
        for (let i = backward.length - 1; i > 0; i--) points.push(backward[i]);
        for (let i = 0; i < forward.length; i++) points.push(forward[i]);

        return {
            points,
            color: strokeCol,
            id: curveID,
            baseWeight
        };
    }

    getPoints(startX, startY, direction, weight, curveID) {
        const p = this.p;
        const settings = this.settings;
        let x = startX;
        let y = startY;
        const points = [];

        const marginX = p.width * settings.margin;
        const marginY = p.height * settings.margin;

        for (let n = 0; n < settings.steps / 2; n++) {
            let gridX = (x + marginX) / settings.resolution;
            let gridY = (y + marginY) / settings.resolution;

            if (gridX < 0 || gridX >= this.flowField.cols - 1 || gridY < 0 || gridY >= this.flowField.rows - 1) break;

            let currentWeight = weight;
            if (settings.tapering) {
                let progress = (n * 2) / settings.steps;
                currentWeight = p.lerp(weight, weight * (1 - settings.taperStrength), progress);
            }

            if (settings.collisionDetection && !settings.followMouse) {
                let occX = Math.floor(x / this.occRes);
                let occY = Math.floor(y / this.occRes);

                if (occX >= 0 && occX < this.occupancyGrid.length && occY >= 0 && occY < this.occupancyGrid[0].length) {
                    let effectiveBuffer = (currentWeight / 2) + settings.collisionBuffer;
                    let buf = Math.ceil(effectiveBuffer / this.occRes);
                    let foundCollision = false;

                    for (let i = -buf; i <= buf; i++) {
                        for (let j = -buf; j <= buf; j++) {
                            let nx = occX + i;
                            let ny = occY + j;
                            if (nx >= 0 && nx < this.occupancyGrid.length && ny >= 0 && ny < this.occupancyGrid[0].length) {
                                let neighborVal = this.occupancyGrid[nx][ny];
                                if (neighborVal !== 0 && neighborVal !== curveID) {
                                    foundCollision = true;
                                    break;
                                }
                            }
                        }
                        if (foundCollision) break;
                    }
                    if (foundCollision) break;

                    let rad = Math.ceil(((currentWeight / 2) + settings.collisionRadius) / this.occRes);
                    for (let i = -rad; i <= rad; i++) {
                        for (let j = -rad; j <= rad; j++) {
                            let nx = occX + i;
                            let ny = occY + j;
                            if (nx >= 0 && nx < this.occupancyGrid.length && ny >= 0 && ny < this.occupancyGrid[0].length) {
                                this.occupancyGrid[nx][ny] = curveID;
                            }
                        }
                    }
                }
            }

            points.push({ x, y, weight: currentWeight });

            let angle = this.flowField.getInterpolatedAngle(gridX, gridY);
            x += settings.stepLength * Math.cos(angle) * direction;
            y += settings.stepLength * Math.sin(angle) * direction;
        }
        return points;
    }

    renderWithSymmetry(curve, renderFunc) {
        const p = this.p;
        const settings = this.settings;

        if (settings.symmetry === 'none') {
            renderFunc(curve);
            return;
        }

        p.push();
        renderFunc(curve);

        if (settings.symmetry === 'horizontal') {
            p.translate(p.width, 0);
            p.scale(-1, 1);
            renderFunc(curve);
        } else if (settings.symmetry === 'vertical') {
            p.translate(0, p.height);
            p.scale(1, -1);
            renderFunc(curve);
        } else if (settings.symmetry === 'radial') {
            const angle = p.TWO_PI / settings.symmetryCount;
            for (let i = 1; i < settings.symmetryCount; i++) {
                p.translate(p.width / 2, p.height / 2);
                p.rotate(angle);
                p.translate(-p.width / 2, -p.height / 2);
                renderFunc(curve);
            }
        }
        p.pop();
    }

    renderCurveStandard(curve) {
        const p = this.p;
        const settings = this.settings;

        this.setStyle(settings.strokeCap);
        p.stroke(curve.color);

        for (let i = 1; i < curve.points.length; i++) {
            const p1 = curve.points[i - 1];
            const p2 = curve.points[i];

            if (settings.segmented) {
                const dist = (i - 1) * settings.stepLength;
                const cycle = settings.segmentLength + settings.segmentGap;
                if (dist % cycle > settings.segmentLength) continue;
            }

            p.strokeWeight(p2.weight);

            let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;

            if (settings.grainMode === 'jitter') {
                const off = settings.grainAmount;
                x1 += p.random(-off, off); y1 += p.random(-off, off);
                x2 += p.random(-off, off); y2 += p.random(-off, off);
            }

            if (settings.grainDensity > 0 && p.random() < settings.grainDensity) {
                if (p.random() > 0.1) p.line(x1, y1, x2, y2);
            } else {
                p.line(x1, y1, x2, y2);
            }
        }
    }

    renderCurveShadow(curve) {
        const p = this.p;
        const settings = this.settings;

        const shadowCol = p.color(0, settings.shadowOpacity * 255);
        p.stroke(shadowCol);
        p.drawingContext.shadowBlur = settings.shadowBlur;
        p.drawingContext.shadowColor = `rgba(0,0,0,${settings.shadowOpacity})`;

        const off = settings.shadowOffset;

        for (let i = 1; i < curve.points.length; i++) {
            const p1 = curve.points[i - 1];
            const p2 = curve.points[i];
            p.strokeWeight(p2.weight);
            p.line(p1.x + off, p1.y + off, p2.x + off, p2.y + off);
        }

        // Reset drawing context for performance
        p.drawingContext.shadowBlur = 0;
    }

    renderCurveWatercolor(curve) {
        const p = this.p;
        const settings = this.settings;

        const layers = settings.watercolorBlobs;
        const baseColor = curve.color;

        for (let l = 0; l < layers; l++) {
            const layerOpacity = p.alpha(baseColor) / layers;
            p.stroke(p.red(baseColor), p.green(baseColor), p.blue(baseColor), layerOpacity);

            for (let i = 1; i < curve.points.length; i++) {
                const p1 = curve.points[i - 1];
                const p2 = curve.points[i];

                // Slightly vary weight and position per layer for "bleed"
                const weightOff = p.random(-1, 1) * (l * 0.5);
                const posOff = p.random(-1, 1) * (l * 0.5);

                p.strokeWeight(p2.weight + weightOff);
                p.line(p1.x + posOff, p1.y + posOff, p2.x + posOff, p2.y + posOff);
            }
        }
    }

    renderCurveSketched(curve) {
        const p = this.p;
        const settings = this.settings;
        const baseColor = curve.color;
        const numBristles = 6;

        for (let b = 0; b < numBristles; b++) {
            const bOffset = p.map(b, 0, numBristles - 1, -0.5, 0.5);
            const bristleAlpha = p.alpha(baseColor) * p.random(0.3, 0.8);
            p.stroke(p.red(baseColor), p.green(baseColor), p.blue(baseColor), bristleAlpha);

            for (let i = 1; i < curve.points.length; i++) {
                const p1 = curve.points[i - 1];
                const p2 = curve.points[i];

                const w = p2.weight;
                const jitter = settings.grainAmount * 0.5;

                const x1 = p1.x + (bOffset * w) + p.random(-jitter, jitter);
                const y1 = p1.y + (bOffset * w) + p.random(-jitter, jitter);
                const x2 = p2.x + (bOffset * w) + p.random(-jitter, jitter);
                const y2 = p2.y + (bOffset * w) + p.random(-jitter, jitter);

                p.strokeWeight(p.random(0.5, 1.5));
                p.line(x1, y1, x2, y2);
            }
        }
    }

    setStyle(cap) {
        const p = this.p;
        if (cap === 'round') {
            p.strokeCap(p.ROUND);
            p.strokeJoin(p.ROUND);
        } else if (cap === 'square') {
            p.strokeCap(p.SQUARE);
            p.strokeJoin(p.BEVEL);
        } else if (cap === 'project') {
            p.strokeCap(p.PROJECT);
            p.strokeJoin(p.MITER);
        }
    }
}
