// src/data.js
export const zones = {
    "ZONE_0_START": {
        id: "ZONE_0_START",
        title: "BOOT SEQUENCE",
        description: "Initializing Construct... Welcome to the Grid Run.\nTarget: THE SOURCE.\n\nManage your INTEGRITY and BANDWIDTH.",
        choices: [
            { label: "Run Diagnostics", effect: { next_node: "ZONE_0_CALIBRATION" } }
        ]
    },
    "ZONE_0_CALIBRATION": {
        id: "ZONE_0_CALIBRATION",
        title: "CALIBRATION",
        description: "Systems Nominal.\nWARNING: Movement costs BANDWIDTH. Hazards damage INTEGRITY.",
        choices: [
            { label: "Jack In: Primordial Web (1980s)", effect: { next_node: "ZONE_1_ARPANET" }, cost: { bandwidth: 5 } }
        ]
    },
    "ZONE_1_ARPANET": {
        id: "ZONE_1_ARPANET",
        title: "ARPANET HUB [1983]",
        description: "Green phosphor and analog hiss. Huge copper cables pulse with slow packets.",
        choices: [
            { label: "Travel to BBS Exchange (Cost: 10 BW)", effect: { next_node: "ZONE_1_BBS" }, cost: { bandwidth: 10 } },
            { label: "Scan for Lost Packets (Cost: 5 HP)", effect: { msg: "Recovered 10 Credits." }, cost: { integrity: 5 }, reward: { credits: 10 } }
        ]
    },
    "ZONE_1_BBS": {
        id: "ZONE_1_BBS",
        title: "THE BBS EXCHANGE",
        description: "Sysops trade warez here. A text-based marketplace.",
        choices: [
            { label: "Buy Bandwidth (+20 BW, Free for Demo)", effect: { msg: "Bandwidth restored." }, reward: { bandwidth: 20 } },
            { label: "Continue to Gibson's Desk (Cost: 15 BW)", effect: { next_node: "ZONE_1_GIBSON" }, cost: { bandwidth: 15 } }
        ]
    },
    "ZONE_1_GIBSON": {
        id: "ZONE_1_GIBSON",
        title: "GIBSON'S DESK",
        description: "A manual Hermes typewriter. This is where 'Cyberspace' was named.",
        choices: [
            { label: "Download Lore (+50 Credits)", effect: { next_node: "ZONE_1_MORRIS" }, reward: { credits: 50 } }
        ]
    },
    "ZONE_1_MORRIS": {
        id: "ZONE_1_MORRIS",
        title: "HAZARD: THE MORRIS WORM",
        description: "A self-replicating mass of code blocks the path!",
        choices: [
            { label: "Deploy Logic Bomb (Cost: 20 BW)", effect: { next_node: "ZONE_1_END" }, cost: { bandwidth: 20 } },
            { label: "Tank Damage (Cost: 30 HP)", effect: { next_node: "ZONE_1_END" }, cost: { integrity: 30 } }
        ]
    },
    "ZONE_1_END": {
        id: "ZONE_1_END",
        title: "ZONE 1 COMPLETE",
        description: "You survived the Analog Age.\nNext: The Grid Wars.",
        choices: [
            { label: "Reboot Simulation", command: "RESET" }
        ]
    }
};