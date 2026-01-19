import { GUI } from 'lil-gui';

/**
 * UTILS
 */

export function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function lerpAngle(p, a, b, t) {
    let diff = b - a;
    while (diff < -p.PI) diff += p.TWO_PI;
    while (diff > p.PI) diff -= p.TWO_PI;
    return a + diff * t;
}

/**
 * CONSTANTS
 */

export const palettes = {
    'Midnight': [
        { color: [20, 24, 82], weight: 0.5 },    // Deep Indigo
        { color: [74, 158, 255], weight: 0.3 },  // Bright Blue
        { color: [255, 74, 158], weight: 0.15 }, // Magenta
        { color: [255, 255, 255], weight: 0.05 } // White
    ],
    'Desert': [
        { color: [194, 63, 48], weight: 0.4 },   // Burnt Orange
        { color: [243, 166, 131], weight: 0.3 }, // Sand
        { color: [84, 11, 14], weight: 0.2 },    // Deep Red
        { color: [255, 225, 104], weight: 0.1 }  // Sun Yellow
    ],
    'Forest': [
        { color: [20, 43, 23], weight: 0.4 },    // Deep Green
        { color: [95, 128, 81], weight: 0.35 },  // Moss
        { color: [181, 158, 123], weight: 0.15 },// Bark
        { color: [242, 100, 121], weight: 0.1 }  // Wild Berry
    ],
    'Vibrant': [
        { color: [255, 0, 128], weight: 0.25 },
        { color: [0, 255, 255], weight: 0.25 },
        { color: [255, 255, 0], weight: 0.25 },
        { color: [128, 0, 255], weight: 0.25 }
    ],
    'Ink': [
        { color: [30, 30, 30], weight: 0.6 },    // Carbon Black
        { color: [60, 60, 60], weight: 0.25 },   // Slate
        { color: [100, 30, 30], weight: 0.1 },   // Dried Blood/Oxblood
        { color: [30, 40, 100], weight: 0.05 }   // Royal Blue Ink
    ],
    'Mono': [
        { color: [20, 20, 20], weight: 0.8 },
        { color: [240, 240, 240], weight: 0.2 }
    ],
    'Celestial': [
        { color: [15, 23, 42], weight: 0.4 },    // Deep Space
        { color: [56, 189, 248], weight: 0.3 },   // Cyan Nebula
        { color: [192, 132, 252], weight: 0.2 },  // Pulsar Purple
        { color: [253, 224, 71], weight: 0.1 }    // Star Gold
    ],
    'Earth': [
        { color: [69, 51, 37], weight: 0.4 },     // Soil
        { color: [150, 126, 84], weight: 0.3 },   // Clay
        { color: [214, 204, 153], weight: 0.2 },  // Dust
        { color: [101, 121, 101], weight: 0.1 }   // Dry Sage
    ],
    'Ember': [
        { color: [50, 20, 10], weight: 0.5 },     // Ash
        { color: [255, 69, 0], weight: 0.3 },     // Flame
        { color: [255, 140, 0], weight: 0.15 },   // Orange
        { color: [255, 255, 0], weight: 0.05 }    // Yellow Spark
    ]
};

export const fidenzaScales = {
    'Small': [
        { min: 1, max: 2, weight: 0.8 },
        { min: 3, max: 5, weight: 0.15 },
        { min: 8, max: 12, weight: 0.05 }
    ],
    'Medium': [
        { min: 1, max: 3, weight: 0.15 },
        { min: 4, max: 8, weight: 0.75 },
        { min: 10, max: 16, weight: 0.1 }
    ],
    'Large': [
        { min: 2, max: 6, weight: 0.1 },
        { min: 12, max: 24, weight: 0.75 },
        { min: 30, max: 50, weight: 0.15 }
    ],
    'Jumbo': [
        { min: 4, max: 10, weight: 0.1 },
        { min: 30, max: 60, weight: 0.8 },
        { min: 70, max: 100, weight: 0.1 }
    ],
    'Jumbo XL': [
        { min: 80, max: 150, weight: 1.0 }
    ],
    'Uniform': [
        { min: 6, max: 6, weight: 1.0 }
    ],
    'Micro-Uniform': [
        { min: 0.5, max: 0.5, weight: 1.0 }
    ],
    'Dynamic': [
        { min: 1, max: 1, weight: 0.4 },
        { min: 10, max: 20, weight: 0.4 },
        { min: 50, max: 100, weight: 0.2 }
    ]
};

/**
 * SETTINGS
 */

export const settings = {
    noiseScale: 0.005,
    octaves: 1,
    persistence: 0.5,
    lacunarity: 2.0,
    seed: 1234,
    resolution: 10,
    margin: 0.2,
    numCurves: 3000,
    steps: 100,
    stepLength: 2,
    thicknessMode: 'fidenza',
    fidenzaScale: 'Jumbo',
    minThickness: 0.5,
    maxThickness: 5,
    strokeWeight: 1,
    strokeCap: 'round',
    opacity: 150,
    tapering: true,
    taperStrength: 0.5,
    shadows: true,
    shadowBlur: 10,
    shadowOffset: 4,
    shadowOpacity: 0.3,
    watercolor: false,
    watercolorBlobs: 3,
    startingMode: 'circlePacking',
    minSeparation: 10,
    collisionDetection: true,
    collisionRadius: 2,
    collisionBuffer: 1,
    grainAmount: 0.5,
    grainDensity: 0.5,
    grainMode: 'sketched',
    fieldMode: 'noise',
    paperTheme: true,
    globalGrain: 0.1,
    colorMode: 'palette',
    selectedPalette: 'Celestial',
    distortion: 'continuous',
    quantizeSteps: 8,
    angleRange: 2,
    animate: true,
    animationSpeed: 10,
    numZones: 3,
    zoneStrength: 0.5,
    symmetry: 'none',
    symmetryCount: 4,
    flowObstacles: false,
    numObstacles: 5,
    segmented: false,
    segmentLength: 10,
    segmentGap: 5,
    showDebug: false,
    followMouse: false,
    randomizePalette: () => { },
    regenerate: () => { }, // Will be set in main
    randomizeSeed: () => { }, // Will be set in main
    saveImage: () => { } // Will be set in main
};

export function setupGUI(settings) {
    const gui = new GUI();
    const f1 = gui.addFolder('Field Generation');
    f1.add(settings, 'fieldMode', ['noise', 'vortex', 'sink']).name('Field Mode');
    f1.add(settings, 'noiseScale', 0.001, 0.05).name('Noise Scale');
    f1.add(settings, 'octaves', 1, 8).step(1).name('Octaves');
    f1.add(settings, 'persistence', 0.1, 1).name('Persistence');
    f1.add(settings, 'lacunarity', 1, 4).name('Lacunarity');
    f1.add(settings, 'seed').name('Seed').listen();
    f1.add(settings, 'resolution', 5, 50).step(1).name('Grid Resolution');
    f1.add(settings, 'margin', 0, 1).name('Field Margin');
    f1.add(settings, 'distortion', ['continuous', 'quantized', 'random']).name('Distortion');
    f1.add(settings, 'quantizeSteps', 2, 20).step(1).name('Quantize Steps');
    f1.add(settings, 'angleRange', 0.1, 4).name('Angle Range (π)');
    f1.add(settings, 'numZones', 0, 10).step(1).name('Flow Zones');
    f1.add(settings, 'zoneStrength', 0, 1).name('Zone influence');
    f1.add(settings, 'symmetry', ['none', 'horizontal', 'vertical', 'radial']).name('Symmetry Mode');
    f1.add(settings, 'symmetryCount', 2, 12).step(1).name('Symmetry Count (Radial)');
    f1.add(settings, 'flowObstacles').name('Avoid Obstacles');
    f1.add(settings, 'numObstacles', 1, 20).step(1).name('Num Obstacles');

    gui.add(settings, 'randomizeSeed').name('Randomize Seed');

    const f2 = gui.addFolder('Curve Settings');
    f2.add(settings, 'startingMode', ['random', 'grid', 'circlePacking']).name('Starting Mode');
    f2.add(settings, 'minSeparation', 2, 50).name('Min Separation');
    f2.add(settings, 'collisionDetection').name('Collision Detection');
    f2.add(settings, 'collisionRadius', 0, 10).name('Extra Footprint');
    f2.add(settings, 'collisionBuffer', 0, 20).name('Sensing Gap');
    f2.add(settings, 'numCurves', 100, 10000).step(100).name('Num Curves');
    f2.add(settings, 'steps', 10, 500).step(10).name('Curve Steps');
    f2.add(settings, 'stepLength', 0.5, 10).name('Step Length');

    const f3 = gui.addFolder('Thickness & Style');
    f3.add(settings, 'thicknessMode', ['constant', 'fidenza', 'random', 'noise']).name('Thickness Mode');
    f3.add(settings, 'fidenzaScale', Object.keys(fidenzaScales)).name('Fidenza Scale');
    f3.add(settings, 'minThickness', 0.1, 10).name('Min Thickness');
    f3.add(settings, 'maxThickness', 0.1, 20).name('Max Thickness');
    f3.add(settings, 'strokeWeight', 0.1, 10).name('Base Weight');
    f3.add(settings, 'strokeCap', ['round', 'square', 'project']).name('Stroke Cap');
    f3.add(settings, 'opacity', 0, 255).name('Opacity');
    f3.add(settings, 'tapering').name('Tapering');
    f3.add(settings, 'taperStrength', 0, 1).name('Taper Strength');
    f3.add(settings, 'segmented').name('Segmented Lines');
    f3.add(settings, 'segmentLength', 1, 100).name('Segment Length');
    f3.add(settings, 'segmentGap', 1, 50).name('Segment Gap');

    const f3b = f3.addFolder('Shadows & Effects');
    f3b.add(settings, 'shadows').name('Enable Shadows');
    f3b.add(settings, 'shadowBlur', 0, 30).name('Shadow Blur');
    f3b.add(settings, 'shadowOffset', 0, 20).name('Shadow Offset');
    f3b.add(settings, 'shadowOpacity', 0, 1).name('Shadow Opacity');
    f3b.add(settings, 'watercolor').name('Watercolor Mode');
    f3b.add(settings, 'watercolorBlobs', 1, 10).step(1).name('Bleed Layers');

    f3.add(settings, 'colorMode', ['white', 'palette', 'gradient', 'noise']).name('Color Mode');
    f3.add(settings, 'selectedPalette', Object.keys(palettes)).name('Selected Palette').listen();
    f3.add(settings, 'randomizePalette').name('Random Palette');

    const f4 = gui.addFolder('Grain & Texture');
    f4.add(settings, 'grainMode', ['none', 'jitter', 'sketched']).name('Texture Mode');
    f4.add(settings, 'grainAmount', 0, 5).name('Texture Intensity');
    f4.add(settings, 'grainDensity', 0, 1).name('Stroke Noise');
    f4.add(settings, 'paperTheme').name('Paper Theme');
    f4.add(settings, 'globalGrain', 0, 0.5).name('Global Grain');

    const f5 = gui.addFolder('Rendering');
    f5.add(settings, 'animate').name('Animate Drawing');
    f5.add(settings, 'animationSpeed', 1, 100).step(1).name('Draw Speed');
    f5.add(settings, 'showDebug').name('Show Debug Info');
    f5.add(settings, 'followMouse').name('React to Mouse');
    f5.add(settings, 'regenerate').name('Regenerate');
    f5.add(settings, 'saveImage').name('Save Image');

    f1.open();
    f2.open();
    f3.open();
    f4.open();

    return gui;
}

/**
 * FLOW FIELD
 */

export class FlowField {
    constructor(p, simplex, settings) {
        this.p = p;
        this.simplex = simplex;
        this.settings = settings;
        this.grid = [];
        this.cols = 0;
        this.rows = 0;
        this.fieldWidth = 0;
        this.fieldHeight = 0;
        this.zones = [];
        this.obstacles = [];
    }

    init() {
        const p = this.p;
        const settings = this.settings;

        const marginX = p.width * settings.margin;
        const marginY = p.height * settings.margin;
        const leftX = -marginX;
        const topY = -marginY;
        const rightX = p.width + marginX;
        const bottomY = p.height + marginY;

        this.fieldWidth = rightX - leftX;
        this.fieldHeight = bottomY - topY;

        this.cols = Math.floor(this.fieldWidth / settings.resolution);
        this.rows = Math.floor(this.fieldHeight / settings.resolution);

        const centerX = p.width / 2;
        const centerY = p.height / 2;

        this.generateZones();
        this.generateObstacles();

        this.grid = new Array(this.cols);
        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = new Array(this.rows);
            for (let j = 0; j < this.rows; j++) {
                let angle;
                const x = i * settings.resolution - p.width * settings.margin;
                const y = j * settings.resolution - p.height * settings.margin;

                if (settings.fieldMode === 'vortex') {
                    const angleToPrev = p.atan2(y - centerY, x - centerX);
                    angle = angleToPrev + p.HALF_PI;
                    angle += this.fBm(x * settings.noiseScale, y * settings.noiseScale) * 0.5;
                } else if (settings.fieldMode === 'sink') {
                    angle = p.atan2(centerY - y, centerX - x);
                    angle += this.fBm(x * settings.noiseScale, y * settings.noiseScale) * 0.5;
                } else {
                    const scaledX = i * settings.noiseScale * settings.resolution;
                    const scaledY = j * settings.noiseScale * settings.resolution;
                    let noiseVal = this.fBm(scaledX, scaledY);
                    angle = p.map(noiseVal, -1, 1, 0, p.PI * settings.angleRange);
                }

                // Apply Zones
                if (this.zones.length > 0) {
                    for (const zone of this.zones) {
                        const d = p.dist(x, y, zone.x, zone.y);
                        if (d < zone.radius) {
                            const influence = p.map(d, 0, zone.radius, 1, 0) * settings.zoneStrength;
                            let targetAngle;
                            if (zone.type === 'vortex') {
                                targetAngle = p.atan2(y - zone.y, x - zone.x) + p.HALF_PI;
                            } else if (zone.type === 'sink') {
                                targetAngle = p.atan2(zone.y - y, zone.x - x);
                            } else {
                                targetAngle = p.atan2(y - zone.y, x - zone.x); // Source
                            }

                            angle = lerpAngle(p, angle, targetAngle, influence);
                        }
                    }
                }

                // Apply Obstacles
                if (settings.flowObstacles && this.obstacles.length > 0) {
                    for (const obs of this.obstacles) {
                        const d = p.dist(x, y, obs.x, obs.y);
                        if (d < obs.radius) {
                            // Push angle away from obstacle center
                            const angleToObs = p.atan2(y - obs.y, x - obs.x);
                            const influence = p.map(d, 0, obs.radius, 1, 0);
                            angle = lerpAngle(p, angle, angleToObs, influence * 0.8);
                        }
                    }
                }

                if (settings.distortion === 'quantized') {
                    const stepSize = p.TWO_PI / settings.quantizeSteps;
                    angle = Math.round(angle / stepSize) * stepSize;
                } else if (settings.distortion === 'random') {
                    angle = p.random(p.TWO_PI);
                }

                this.grid[i][j] = angle;
            }
        }
    }

    generateZones() {
        const p = this.p;
        const settings = this.settings;
        this.zones = [];

        for (let i = 0; i < settings.numZones; i++) {
            this.zones.push({
                x: p.random(p.width),
                y: p.random(p.height),
                radius: p.random(200, 600),
                type: p.random(['vortex', 'sink', 'source']),
                strength: p.random(0.2, 0.8)
            });
        }
    }

    generateObstacles() {
        const p = this.p;
        const settings = this.settings;
        this.obstacles = [];

        if (!settings.flowObstacles) return;

        for (let i = 0; i < settings.numObstacles; i++) {
            this.obstacles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                radius: p.random(50, 200)
            });
        }
    }

    fBm(x, y) {
        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxValue = 0;

        for (let i = 0; i < this.settings.octaves; i++) {
            value += this.simplex(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= this.settings.persistence;
            frequency *= this.settings.lacunarity;
        }

        return value / maxValue;
    }

    getInterpolatedAngle(gx, gy) {
        let x0 = Math.floor(gx);
        let y0 = Math.floor(gy);
        let x1 = x0 + 1;
        let y1 = y0 + 1;

        // Clamp to grid boundaries
        x0 = Math.max(0, Math.min(x0, this.cols - 1));
        y0 = Math.max(0, Math.min(y0, this.rows - 1));
        x1 = Math.max(0, Math.min(x1, this.cols - 1));
        y1 = Math.max(0, Math.min(y1, this.rows - 1));

        const tx = gx - x0;
        const ty = gy - y0;

        const a00 = this.grid[x0][y0];
        const a10 = this.grid[x1][y0];
        const a01 = this.grid[x0][y1];
        const a11 = this.grid[x1][y1];

        const top = lerpAngle(this.p, a00, a10, tx);
        const bottom = lerpAngle(this.p, a01, a11, tx);
        let angle = lerpAngle(this.p, top, bottom, ty);

        if (this.settings.followMouse) {
            const p = this.p;
            // Map grid coords back to screen coords
            const sx = gx * this.settings.resolution - p.width * this.settings.margin;
            const sy = gy * this.settings.resolution - p.height * this.settings.margin;
            const d = p.dist(sx, sy, p.mouseX, p.mouseY);
            const radius = 250;

            if (d < radius) {
                const influence = p.map(d, 0, radius, 1, 0) * 0.6;
                const targetAngle = p.atan2(sy - p.mouseY, sx - p.mouseX) + p.HALF_PI; // Vortex
                angle = lerpAngle(p, angle, targetAngle, influence);
            }
        }

        return angle;
    }

    renderDebug() {
        const p = this.p;
        p.push();
        p.noFill();
        p.strokeWeight(1);

        // Zones
        for (const zone of this.zones) {
            p.stroke(0, 255, 0, 100);
            if (zone.type === 'vortex') p.stroke(0, 0, 255, 100);
            if (zone.type === 'sink') p.stroke(255, 0, 0, 100);
            p.circle(zone.x, zone.y, zone.radius * 2);
            p.circle(zone.x, zone.y, 5);
        }

        // Obstacles
        for (const obs of this.obstacles) {
            p.stroke(255, 165, 0, 150);
            p.circle(obs.x, obs.y, obs.radius * 2);
            p.fill(255, 165, 0, 50);
            p.circle(obs.x, obs.y, obs.radius * 2);
            p.noFill();
        }
        p.pop();
    }
}

/**
 * CURVE MANAGER
 */

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

            let angle = this.flowField.getInterpolatedAngle(gridX, gridY);
            points.push({ x, y, weight: currentWeight, angle });
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

            // Draw with overlap for square caps to prevent gaps
            if (settings.strokeCap !== 'round' && p1.angle !== undefined) {
                const overlap = 0.5;
                const ox = Math.cos(p1.angle) * overlap;
                const oy = Math.sin(p1.angle) * overlap;
                x2 += ox;
                y2 += oy;
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

        this.setStyle(settings.strokeCap);
        const shadowCol = p.color(0, settings.shadowOpacity * 255);
        p.stroke(shadowCol);
        p.drawingContext.shadowBlur = settings.shadowBlur;
        p.drawingContext.shadowColor = `rgba(0,0,0,${settings.shadowOpacity})`;

        const off = settings.shadowOffset;

        for (let i = 1; i < curve.points.length; i++) {
            const p1 = curve.points[i - 1];
            const p2 = curve.points[i];
            p.strokeWeight(p2.weight);

            let x1 = p1.x + off, y1 = p1.y + off, x2 = p2.x + off, y2 = p2.y + off;
            if (settings.strokeCap !== 'round' && p1.angle !== undefined) {
                const overlap = 0.5;
                const ox = Math.cos(p1.angle) * overlap;
                const oy = Math.sin(p1.angle) * overlap;
                x2 += ox;
                y2 += oy;
            }
            p.line(x1, y1, x2, y2);
        }

        // Reset drawing context for performance
        p.drawingContext.shadowBlur = 0;
    }

    renderCurveWatercolor(curve) {
        const p = this.p;
        const settings = this.settings;

        const layers = settings.watercolorBlobs;
        const baseColor = curve.color;

        this.setStyle(settings.strokeCap);
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

                let x1 = p1.x + posOff, y1 = p1.y + posOff, x2 = p2.x + posOff, y2 = p2.y + posOff;
                if (settings.strokeCap !== 'round' && p1.angle !== undefined) {
                    const overlap = 0.5;
                    const ox = Math.cos(p1.angle) * overlap;
                    const oy = Math.sin(p1.angle) * overlap;
                    x2 += ox;
                    y2 += oy;
                }
                p.line(x1, y1, x2, y2);
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
            p.strokeJoin(p.MITER);
        } else if (cap === 'project') {
            p.strokeCap(p.PROJECT);
            p.strokeJoin(p.MITER);
        }
    }
}
