// zones.js
export const zones = {
    // --- TUTORIAL ---
    "ZONE_0_START": {
        id: "ZONE_0_START",
        title: "BOOT SEQUENCE",
        description: "Initializing Construct... Welcome to the Grid Run.\n\nYour goal is to reach THE SOURCE. You must manage your INTEGRITY (Health) and BANDWIDTH (Fuel).",
        choices: [
            { label: "Run Diagnostics", effect: { next_node: "ZONE_0_CALIBRATION" } }
        ]
    },
    "ZONE_0_CALIBRATION": {
        id: "ZONE_0_CALIBRATION",
        title: "CALIBRATION",
        description: "Systems Nominal.\n\nWARNING: Movement costs BANDWIDTH. Hazards damage INTEGRITY.\n\nHistory is dangerous. Are you ready?",
        choices: [
            {
                label: "Jack In: The Primordial Web (1980s)", 
                effect: { next_node: "ZONE_1_ARPANET" },
                cost: { bandwidth: 5 }
            }
        ]
    },

    // --- ZONE 1: THE PRIMORDIAL WEB ---
    "ZONE_1_ARPANET": {
        id: "ZONE_1_ARPANET",
        title: "ARPANET HUB [1983]",
        description: "You emerge in a realm of green phosphor and analog hiss. Huge copper cables pulse with the first slow packets of data.\n\nThis is the backbone. The beginning.",
        choices: [
            {
                label: "Travel to The BBS Exchange (Cost: 10 BW)", 
                effect: { next_node: "ZONE_1_BBS" },
                cost: { bandwidth: 10 }
            },
            {
                label: "Scan for Lost Packets (Cost: 5 Integrity, +10 Credits)",
                cost: { integrity: 5 },
                reward: { credits: 10 },
                effect: { next_node: "ZONE_1_ARPANET_SCANNED" }
            }
        ]
    },
    "ZONE_1_ARPANET_SCANNED": {
        id: "ZONE_1_ARPANET_SCANNED",
        title: "ARPANET HUB [1983]",
        description: ">> SCAN COMPLETE: Recovered fragmented headers. +10 Credits.\n\nThe copper cables still hum with ancient data.",
        choices: [
            {
                label: "Travel to The BBS Exchange (Cost: 10 BW)", 
                effect: { next_node: "ZONE_1_BBS" },
                cost: { bandwidth: 10 }
            }
        ]
    },
    "ZONE_1_BBS": {
        id: "ZONE_1_BBS",
        title: "THE BBS EXCHANGE",
        description: "A text-based marketplace floats in the void. Sysops trade warez and baud-rate upgrades.",
        choices: [
            {
                label: "Buy Bandwidth Patch (+20 BW, -10 Credits)",
                cost: { credits: 10 }, // Engine needs credit logic update for this, skipping for MVP simplicity or treating as free for now
                reward: { bandwidth: 20 },
                effect: { msg: "Bandwidth restored." }
            },
            {
                label: "Continue to Gibson's Desk (Cost: 15 BW)",
                effect: { next_node: "ZONE_1_GIBSON" },
                cost: { bandwidth: 15 }
            }
        ]
    },
    "ZONE_1_GIBSON": {
        id: "ZONE_1_GIBSON",
        title: "GIBSON'S DESK",
        description: "A manual Hermes typewriter sits alone in the static. This is where 'Cyberspace' was named.\n\nLORE: William Gibson coined the term in 'Neuromancer' (1984) before he had ever seen a computer.",
        choices: [
            {
                label: "Download Lore Data (+50 Credits)",
                reward: { credits: 50 },
                effect: { next_node: "ZONE_1_MORRIS" }
            }
        ]
    },
    "ZONE_1_MORRIS": {
        id: "ZONE_1_MORRIS",
        title: "HAZARD: THE MORRIS WORM [1988]",
        description: "WARNING! A self-replicating mass of code blocks your path. It is the first worm to span the net.\n\nIt attempts to overwrite your buffer!",
        choices: [
            {
                label: "Deploy Logic Bomb (Cost: 20 BW)",
                cost: { bandwidth: 20 },
                effect: { next_node: "ZONE_1_END" }
            },
            {
                label: "Tank the Damage (Cost: 30 Integrity)",
                cost: { integrity: 30 },
                effect: { next_node: "ZONE_1_END" }
            }
        ]
    },
    "ZONE_1_END": {
        id: "ZONE_1_END",
        title: "ZONE 1 COMPLETE",
        description: "You have survived the Analog Age. The static clears.\n\n>> TRANSMISSION ENDS <<\nZone 2: THE BATTLEGROUNDS (1995) is under construction.\n\nThank you for playing the Grid Run Prototype!",
        choices: [
            {
                label: "[RESTART] Reboot Simulation",
                command: "RESET"
            }
        ]
    }
};