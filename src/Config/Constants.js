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
