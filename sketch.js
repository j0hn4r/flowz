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
    thicknessMode: 'constant',
    minThickness: 0.5,
    maxThickness: 5,
    strokeWeight: 1,
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
    f3.add(settings, 'thicknessMode', ['constant', 'random', 'noise']).name('Thickness Mode');
    f3.add(settings, 'minThickness', 0.1, 10).name('Min Thickness');
    f3.add(settings, 'maxThickness', 0.1, 20).name('Max Thickness');
    f3.add(settings, 'strokeWeight', 0.1, 10).name('Base Weight');
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
                p.background(11, 14, 20);
                document.body.classList.remove('paper-theme');
            }

            const rng = mulberry32(settings.seed);
            simplex = createNoise2D(rng);

            flowField = new FlowField(p, simplex, settings);
            flowField.init();

            curveManager = new CurveManager(p, flowField, settings);
            curveManager.init();

            if (!settings.animate) {
                curveManager.render();
                applyGlobalGrain();
            }

            if (settings.showDebug) {
                flowField.renderDebug();
            }

            if (loading) loading.style.display = 'none';
            isGenerating = false;
        }, 10);
    }

    p.draw = () => {
        if (settings.followMouse && !isGenerating) {
            // Re-render everything if mouse interaction is on
            if (settings.paperTheme) {
                p.background(235, 230, 220);
            } else {
                p.background(11, 14, 20);
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
    if (settings.thicknessMode === 'random') {
        weight = random(settings.minThickness, settings.maxThickness);
    } else if (settings.thicknessMode === 'noise') {
        let n = fBm(startX * 0.005, startY * 0.005);
        weight = map(n, -1, 1, settings.minThickness, settings.maxThickness);
    }
    strokeWeight(weight);

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

        if (settings.showDebug && flowField) {
            flowField.renderDebug();
        }

        if (!settings.animate || isGenerating || !curveManager) return;

        const stillRendering = curveManager.renderNextBatch(settings.animationSpeed);
        if (!stillRendering && curveManager.renderedCount === curveManager.curves.length) {
            // Just finished
            applyGlobalGrain();
            curveManager.renderedCount++; // Prevent re-applying grain
        }
    };

    function applyGlobalGrain() {
        if (settings.globalGrain <= 0) return;
        p.loadPixels();
        for (let i = 0; i < p.pixels.length; i += 4) {
            let grain = p.random(-255, 255) * settings.globalGrain;
            p.pixels[i] += grain;
            p.pixels[i + 1] += grain;
            p.pixels[i + 2] += grain;
        }
        p.updatePixels();
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initFlowField();
    };

    p.keyPressed = () => {
        if (p.key === 'r' || p.key === 'R') {
            settings.randomizeSeed();
        } else if (p.key === 'p' || p.key === 'P') {
            settings.randomizePalette();
        } else if (p.key === 's' || p.key === 'S') {
            settings.saveImage();
        } else if (p.key === 'h' || p.key === 'H') {
            const gui = document.querySelector('.lil-gui');
            if (gui) {
                gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
            }
            const overlay = document.getElementById('ui-overlay');
            if (overlay) {
                overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
            }
        }
    };
});
