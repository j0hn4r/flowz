import p5 from 'p5';
import { createNoise2D } from 'simplex-noise';
import { FlowField, CurveManager, settings, setupGUI, mulberry32, palettes } from './src/engine.js';

new p5((p) => {
    let flowField;
    let curveManager;
    let simplex;
    let isGenerating = false;

    p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('canvas-container');

        // Initialize Settings methods
        settings.regenerate = () => initFlowField();
        settings.randomizeSeed = () => {
            settings.seed = Math.floor(Math.random() * 99999);
            initFlowField();
        };
        settings.randomizePalette = () => {
            const keys = Object.keys(palettes);
            settings.selectedPalette = keys[Math.floor(Math.random() * keys.length)];
            initFlowField();
        };
        settings.saveImage = () => p.saveCanvas('flow-field', 'png');

        setupGUI(settings);
        initFlowField();
    };

    async function initFlowField() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';
        isGenerating = true;

        // Use setTimeout to allow UI to update before heavy calculation
        setTimeout(() => {
            const rng = mulberry32(settings.seed);
            simplex = createNoise2D(rng);

            flowField = new FlowField(p, simplex, settings);
            flowField.init();

            curveManager = new CurveManager(p, flowField, settings);
            curveManager.init();

            if (settings.paperTheme) {
                p.background(235, 230, 220);
                document.body.classList.add('paper-theme');
            } else {
                p.background(11, 14, 20);
                document.body.classList.remove('paper-theme');
            }

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

            // Re-init curve manager to re-calculate paths based on new mouse influence
            curveManager.init();
            curveManager.render();
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
