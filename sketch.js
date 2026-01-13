/**
 * Flow Field Web App
 * Based on techniques by Tyler Hobbs
 */

let grid = [];
let cols, rows;
let resolution = 10;
let fieldWidth, fieldHeight;
let simplex;
let occupancyGrid = [];
let occRes = 1;

const palettes = {
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
    ]
};

const fidenzaScales = {
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
    ]
};

const settings = {
    noiseScale: 0.005,
    octaves: 1,
    persistence: 0.5,
    lacunarity: 2.0,
    seed: 1234,
    resolution: 10,
    margin: 0.2, // 20% extra margin
    numCurves: 1500,
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
    startingMode: 'circlePacking',
    minSeparation: 10,
    collisionDetection: true,
    collisionRadius: 2,
    collisionBuffer: 1,
    grainAmount: 0.5,
    grainDensity: 0.5,
    grainMode: 'none',
    fieldMode: 'noise',
    paperTheme: false,
    globalGrain: 0.1,
    colorMode: 'white',
    selectedPalette: 'Midnight',
    distortion: 'continuous',
    quantizeSteps: 8,
    angleRange: 2, // Multiplier for PI
    regenerate: () => initFlowField(),
    randomizeSeed: () => {
        settings.seed = Math.floor(Math.random() * 99999);
        initFlowField();
    },
    saveImage: () => saveCanvas('flow-field', 'png')
};

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    // UI Setup
    const gui = new dat.GUI();
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

    gui.add(settings, 'randomizeSeed').name('Randomize Seed');

    const f2 = gui.addFolder('Curve Settings');
    f2.add(settings, 'startingMode', ['random', 'grid', 'circlePacking']).name('Starting Mode');
    f2.add(settings, 'minSeparation', 2, 50).name('Min Separation');
    f2.add(settings, 'collisionDetection').name('Collision Detection');
    f2.add(settings, 'collisionRadius', 0, 10).name('Extra Footprint');
    f2.add(settings, 'collisionBuffer', 0, 20).name('Sensing Gap');
    f2.add(settings, 'numCurves', 100, 5000).step(100).name('Num Curves');
    f2.add(settings, 'steps', 10, 500).step(10).name('Curve Steps');
    f2.add(settings, 'stepLength', 0.5, 10).name('Step Length');

    const f3 = gui.addFolder('Thickness & Style');
    f3.add(settings, 'thicknessMode', ['constant', 'fidenza', 'random', 'noise']).name('Thickness Mode');
    f3.add(settings, 'fidenzaScale', Object.keys(fidenzaScales)).name('Fidenza Scale');
    f3.add(settings, 'minThickness', 0.1, 10).name('Min Thickness');
    f3.add(settings, 'maxThickness', 0.1, 20).name('Max Thickness');
    f3.add(settings, 'strokeWeight', 0.1, 10).name('Base Weight');
    f3.add(settings, 'strokeCap', ['round', 'square', 'project']).name('Stroke Cap').onChange(() => initFlowField());
    f3.add(settings, 'opacity', 0, 255).name('Opacity');
    f3.add(settings, 'tapering').name('Tapering');
    f3.add(settings, 'taperStrength', 0, 1).name('Taper Strength');
    f3.add(settings, 'colorMode', ['white', 'palette', 'gradient', 'noise']).name('Color Mode');
    f3.add(settings, 'selectedPalette', Object.keys(palettes)).name('Selected Palette');
    f3.open();

    const f4 = gui.addFolder('Grain & Texture');
    f4.add(settings, 'grainMode', ['none', 'jitter', 'sketched']).name('Texture Mode');
    f4.add(settings, 'grainAmount', 0, 5).name('Texture Intensity');
    f4.add(settings, 'grainDensity', 0, 1).name('Stroke Noise');
    f4.add(settings, 'paperTheme').name('Paper Theme').onChange(() => initFlowField());
    f4.add(settings, 'globalGrain', 0, 0.5).name('Global Grain');
    f4.open();

    gui.add(settings, 'regenerate').name('Regenerate');
    gui.add(settings, 'saveImage').name('Save Image');

    f1.open();
    f2.open();

    initFlowField();
}

function initFlowField() {
    if (settings.paperTheme) {
        background(235, 230, 220); // Warm paper color
    } else {
        background(11, 14, 20); // Dark theme
    }

    simplex = new SimplexNoise(settings.seed);

    // Calculate field boundaries with margin
    const marginX = width * settings.margin;
    const marginY = height * settings.margin;
    const leftX = -marginX;
    const topY = -marginY;
    const rightX = width + marginX;
    const bottomY = height + marginY;

    fieldWidth = rightX - leftX;
    fieldHeight = bottomY - topY;

    cols = Math.floor(fieldWidth / settings.resolution);
    rows = Math.floor(fieldHeight / settings.resolution);

    // Calculate center for vortex/sink
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize grid
    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            let angle;
            // Correct world coordinates for this grid cell
            const x = i * settings.resolution - width * settings.margin;
            const y = j * settings.resolution - height * settings.margin;

            if (settings.fieldMode === 'vortex') {
                const angleToPrev = atan2(y - centerY, x - centerX);
                angle = angleToPrev + HALF_PI; // Circular flow
                // Add minor noise for variation
                angle += fBm(x * settings.noiseScale, y * settings.noiseScale) * 0.5;
            } else if (settings.fieldMode === 'sink') {
                angle = atan2(centerY - y, centerX - x); // Flow inward
                angle += fBm(x * settings.noiseScale, y * settings.noiseScale) * 0.5;
            } else {
                const scaledX = i * settings.noiseScale * settings.resolution;
                const scaledY = j * settings.noiseScale * settings.resolution;
                let noiseVal = fBm(scaledX, scaledY);
                angle = map(noiseVal, -1, 1, 0, PI * settings.angleRange);
            }

            if (settings.distortion === 'quantized') {
                const stepSize = TWO_PI / settings.quantizeSteps;
                angle = Math.round(angle / stepSize) * stepSize;
            } else if (settings.distortion === 'random') {
                angle = random(TWO_PI);
            }

            grid[i][j] = angle;
        }
    }

    // Initialize occupancy grid with 0s (32-bit for curve IDs)
    const occCols = Math.ceil(width / occRes);
    const occRows = Math.ceil(height / occRes);
    occupancyGrid = new Array(occCols);
    for (let x = 0; x < occCols; x++) {
        occupancyGrid[x] = new Uint32Array(occRows).fill(0);
    }

    renderField();
    applyGlobalGrain();
}

function applyGlobalGrain() {
    if (settings.globalGrain <= 0) return;
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        let grain = random(-255, 255) * settings.globalGrain;
        pixels[i] += grain;
        pixels[i + 1] += grain;
        pixels[i + 2] += grain;
    }
    updatePixels();
}

function renderField() {
    strokeWeight(settings.strokeWeight);
    noFill();

    if (settings.startingMode === 'circlePacking') {
        const points = [];
        const maxAttempts = 50;
        for (let i = 0; i < settings.numCurves; i++) {
            let placed = false;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const x = random(width);
                const y = random(height);
                let tooClose = false;
                for (const p of points) {
                    if (dist(x, y, p.x, p.y) < settings.minSeparation) {
                        tooClose = true;
                        break;
                    }
                }
                if (!tooClose) {
                    points.push({ x, y });
                    drawCurve(x, y, i + 1);
                    placed = true;
                    break;
                }
            }
            if (!placed && i > settings.numCurves / 2) break;
        }
    } else if (settings.startingMode === 'grid') {
        const spacing = Math.sqrt((width * height) / settings.numCurves);
        let id = 1;
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                drawCurve(x, y, id++);
            }
        }
    } else {
        for (let i = 0; i < settings.numCurves; i++) {
            drawCurve(random(width), random(height), i + 1);
        }
    }
}

function drawCurve(startX, startY, curveID) {
    let x = startX;
    let y = startY;

    // Calculate thickness for this curve
    let weight = settings.strokeWeight;
    if (settings.thicknessMode === 'fidenza') {
        const bins = fidenzaScales[settings.fidenzaScale];
        let r = random();
        let cumulative = 0;
        let selectedBin = bins[0];
        for (const bin of bins) {
            cumulative += bin.weight;
            if (r < cumulative) {
                selectedBin = bin;
                break;
            }
        }
        weight = random(selectedBin.min, selectedBin.max);
    } else if (settings.thicknessMode === 'random') {
        weight = random(settings.minThickness, settings.maxThickness);
    } else if (settings.thicknessMode === 'noise') {
        let n = fBm(startX * 0.005, startY * 0.005);
        weight = map(n, -1, 1, settings.minThickness, settings.maxThickness);
    }
    strokeWeight(weight);
    if (settings.strokeCap === 'round') {
        strokeCap(ROUND);
        strokeJoin(ROUND);
    } else if (settings.strokeCap === 'square') {
        strokeCap(SQUARE);
        strokeJoin(BEVEL);
    } else if (settings.strokeCap === 'project') {
        strokeCap(PROJECT);
        strokeJoin(MITER);
    }

    // Color logic
    if (settings.colorMode === 'palette') {
        const palette = palettes[settings.selectedPalette];
        let r = random();
        let cumulative = 0;
        let chosenColor = palette[0].color;
        for (const entry of palette) {
            cumulative += entry.weight;
            if (r < cumulative) {
                chosenColor = entry.color;
                break;
            }
        }
        stroke(chosenColor[0], chosenColor[1], chosenColor[2], settings.opacity);
    } else if (settings.colorMode === 'white') {
        if (settings.paperTheme) {
            stroke(40, 40, 40, settings.opacity); // Dark ink for paper if "white" is selected
        } else {
            stroke(255, settings.opacity);
        }
    } else if (settings.colorMode === 'gradient') {
        const inter = map(x, 0, width, 0, 1);
        const c = lerpColor(color(74, 158, 255), color(255, 74, 158), inter);
        stroke(red(c), green(c), blue(c), settings.opacity);
    } else if (settings.colorMode === 'noise') {
        const n = fBm(x * 0.01, y * 0.01);
        const h = map(n, -1, 1, 180, 240);
        colorMode(HSB);
        stroke(h, 80, 100, settings.opacity / 255);
        colorMode(RGB);
    }

    // Adjust coordinates relative to grid
    const marginX = width * settings.margin;
    const marginY = height * settings.margin;

    let px = x;
    let py = y;

    for (let n = 0; n < settings.steps; n++) {
        // Find grid index for interpolation
        let gridX = (x + marginX) / settings.resolution;
        let gridY = (y + marginY) / settings.resolution;

        // Bounds check
        if (gridX < 0 || gridX >= cols - 1 || gridY < 0 || gridY >= rows - 1) {
            break;
        }

        // Tapering logic
        let currentWeight = weight;
        if (settings.tapering) {
            let progress = n / settings.steps;
            currentWeight = lerp(weight, weight * (1 - settings.taperStrength), progress);
        }
        strokeWeight(currentWeight);

        // Collision check
        if (settings.collisionDetection) {
            let occX = Math.floor(x / occRes);
            let occY = Math.floor(y / occRes);

            if (occX >= 0 && occX < occupancyGrid.length && occY >= 0 && occY < occupancyGrid[0].length) {
                let effectiveBuffer = currentWeight / 2 + settings.collisionBuffer;
                let buf = Math.ceil(effectiveBuffer / occRes);
                let foundCollision = false;

                for (let i = -buf; i <= buf; i++) {
                    for (let j = -buf; j <= buf; j++) {
                        let nx = occX + i;
                        let ny = occY + j;
                        if (nx >= 0 && nx < occupancyGrid.length && ny >= 0 && ny < occupancyGrid[0].length) {
                            let neighborVal = occupancyGrid[nx][ny];
                            if (neighborVal !== 0 && neighborVal !== curveID) {
                                foundCollision = true;
                                break;
                            }
                        }
                    }
                    if (foundCollision) break;
                }
                if (foundCollision) break;

                // Mark neighborhood with our ID
                let rad = Math.ceil((currentWeight / 2 + settings.collisionRadius) / occRes);
                for (let i = -rad; i <= rad; i++) {
                    for (let j = -rad; j <= rad; j++) {
                        let nx = occX + i;
                        let ny = occY + j;
                        if (nx >= 0 && nx < occupancyGrid.length && ny >= 0 && ny < occupancyGrid[0].length) {
                            occupancyGrid[nx][ny] = curveID;
                        }
                    }
                }
            }
        }

        if (n > 0) {
            let drawX = x;
            let drawY = y;
            let drawPX = px;
            let drawPY = py;

            if (settings.grainMode === 'jitter') {
                drawX += random(-settings.grainAmount, settings.grainAmount);
                drawY += random(-settings.grainAmount, settings.grainAmount);
                drawPX += random(-settings.grainAmount, settings.grainAmount);
                drawPY += random(-settings.grainAmount, settings.grainAmount);
            } else if (settings.grainMode === 'sketched') {
                // Draw multiple faint, offset lines
                for (let i = 0; i < 3; i++) {
                    let off = settings.grainAmount * 0.5;
                    let ox = random(-off, off);
                    let oy = random(-off, off);
                    stroke(red(drawingContext.strokeStyle), green(drawingContext.strokeStyle), blue(drawingContext.strokeStyle), settings.opacity * 0.5);
                    line(drawPX + ox, drawPY + oy, drawX + ox, drawY + oy);
                }
            }

            if (settings.grainDensity > 0 && random() < settings.grainDensity) {
                // Skip some segments or add gaps for a "rough" look
                if (random() > 0.1) line(drawPX, drawPY, drawX, drawY);
            } else {
                line(px, py, x, y);
            }
        }

        px = x;
        py = y;

        let angle = getInterpolatedAngle(gridX, gridY);
        x += settings.stepLength * cos(angle);
        y += settings.stepLength * sin(angle);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initFlowField();
}

function fBm(x, y) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < settings.octaves; i++) {
        value += simplex.noise2D(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= settings.persistence;
        frequency *= settings.lacunarity;
    }

    return value / maxValue;
}

function lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff < -PI) diff += TWO_PI;
    while (diff > PI) diff -= TWO_PI;
    return a + diff * t;
}

function getInterpolatedAngle(gx, gy) {
    let x0 = Math.floor(gx);
    let y0 = Math.floor(gy);
    let x1 = x0 + 1;
    let y1 = y0 + 1;

    let tx = gx - x0;
    let ty = gy - y0;

    let a00 = grid[x0][y0];
    let a10 = grid[x1][y0];
    let a01 = grid[x0][y1];
    let a11 = grid[x1][y1];

    let top = lerpAngle(a00, a10, tx);
    let bottom = lerpAngle(a01, a11, tx);
    return lerpAngle(top, bottom, ty);
}
