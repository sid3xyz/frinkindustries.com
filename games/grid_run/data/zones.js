// zones.js
// Temporary test data for Phase 1

export const zones = {
    "ZONE_0_START": {
        id: "ZONE_0_START",
        title: "BOOT SEQUENCE",
        description: "Initializing Construct... Welcome to the Grid Run. Your goal is to reach Straylight. Choose your path.",
        choices: [
            {
                label: "Begin Calibration",
                effect: { next_node: "ZONE_0_CALIBRATION" }
            }
        ]
    },
    "ZONE_0_CALIBRATION": {
        id: "ZONE_0_CALIBRATION",
        title: "CALIBRATION",
        description: "Systems check complete. Integrity: 100%. Bandwidth: 100%. You are ready to enter the network.",
        choices: [
            {
                label: "Enter Zone 1: The Primordial Web",
                effect: { next_node: "ZONE_1_START" },
                cost: { bandwidth: 10 }
            }
        ]
    },
    "ZONE_1_START": {
        id: "ZONE_1_START",
        title: "ARPANET HUB",
        description: "The air tastes of ozone and copper. Ancient protocols hum around you. You have arrived in the 1980s.",
        choices: [
            {
                label: "Explore",
                effect: { next_node: "ZONE_0_START" } // Loop for now
            }
        ]
    }
};
