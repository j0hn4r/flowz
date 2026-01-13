/**
 * Seeded random number generator (Mulberry32)
 */
export function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Linear interpolation between angles, handling wrap-around
 */
export function lerpAngle(p, a, b, t) {
    let diff = b - a;
    while (diff < -p.PI) diff += p.TWO_PI;
    while (diff > p.PI) diff -= p.TWO_PI;
    return a + diff * t;
}
