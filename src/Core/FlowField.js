import { lerpAngle } from '../Utils/Math.js';

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
                    let totalInfluence = 0;
                    let zoneAngle = 0;

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
