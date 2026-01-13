import { palettes, fidenzaScales } from './Constants.js';
import { GUI } from 'lil-gui';

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
