/**
 * GRID_RUN - Game Data
 * Constants, landmarks, events, illnesses, and Malcolm quotes
 */

// =============================================================================
// PROFESSIONS
// =============================================================================

export const PROFESSIONS = {
  hacker: {
    name: "Hacker",
    credits: 400,
    multiplier: 3,
    description: "You know the system from the inside. Less resources, but every win counts triple."
  },
  sysop: {
    name: "Sysop", 
    credits: 800,
    multiplier: 2,
    description: "You've kept servers running for decades. Balanced approach."
  },
  scriptkiddie: {
    name: "Script Kiddie",
    credits: 1600,
    multiplier: 1,
    description: "You've got tools you don't understand. Money compensates for skill."
  }
};

// =============================================================================
// STORE PRICES
// =============================================================================

export const STORE_PRICES = {
  bandwidth: 50,      // per channel
  data: 0.20,         // per packet
  shielding: 15,      // per layer
  scripts: 2,         // per package
  diskPatch: 20,
  cablePatch: 20,
  adapterPatch: 20
};

// =============================================================================
// STARTING MONTH OPTIONS
// =============================================================================

export const START_MONTHS = [
  { month: 3, name: "March", description: "Early start. More time, worse conditions." },
  { month: 4, name: "April", description: "Standard departure. Balanced." },
  { month: 5, name: "May", description: "Peak season. Good conditions." },
  { month: 6, name: "June", description: "Late start. Better weather, less margin." },
  { month: 7, name: "July", description: "Very late. Race against time." }
];

// =============================================================================
// ILLNESSES (System Failures)
// =============================================================================

export const ILLNESSES = [
  {
    id: "buffer_overflow",
    name: "Buffer Overflow",
    severity: 10,
    message: "has a buffer overflow",
    malcolmQuote: "Too much data, not enough bounds checking. Classic."
  },
  {
    id: "memory_leak",
    name: "Memory Leak",
    severity: 8,
    message: "is suffering from memory leak",
    malcolmQuote: "Slowly losing themselves, bit by bit. I've seen it before."
  },
  {
    id: "kernel_panic",
    name: "Kernel Panic",
    severity: 15,
    message: "is experiencing kernel panic",
    malcolmQuote: "Total system failure. The core itself is screaming."
  },
  {
    id: "bit_rot",
    name: "Bit Rot",
    severity: 5,
    message: "has bit rot",
    malcolmQuote: "The slow decay of digital flesh. Time claims everything."
  },
  {
    id: "segfault",
    name: "Segfault",
    severity: 12,
    message: "has a segmentation fault",
    malcolmQuote: "Invalid memory access. Tried to remember something that wasn't theirs."
  },
  {
    id: "stack_overflow",
    name: "Stack Overflow",
    severity: 10,
    message: "has stack overflow",
    malcolmQuote: "Recursion without base case. A philosophical death."
  }
];

// =============================================================================
// LANDMARKS (16 total, 3 eras)
// =============================================================================

export const LANDMARKS = [
  // ERA 1: The Primordial Web (Miles 0-680)
  {
    id: "arpanet",
    name: "ARPANET Terminal",
    miles: 0,
    type: "start",
    era: 1,
    hasStore: true,
    description: "October 29, 1969. The first node. Where it all began.",
    malcolmQuote: "LO. That's all they got out before it crashed. The first word of the internet was a broken promise. The full message was supposed to be 'LOGIN'. They only made it to 'LO' before the system died. And somehow, that feels right."
  },
  {
    id: "bbs",
    name: "BBS Exchange",
    miles: 125,
    type: "fort",
    era: 1,
    hasStore: true,
    description: "Dial-up marketplace of warez and wisdom. 300 baud dreams.",
    malcolmQuote: "I spent my youth here. 300 baud and dreaming. You'd wait twenty minutes for a picture to load, and it was worth every second. The anticipation was half the magic."
  },
  {
    id: "gibson",
    name: "Gibson's Desk",
    miles: 250,
    type: "scenic",
    era: 1,
    hasStore: false,
    description: "Where 'cyberspace' was named. A typewriter and a vision.",
    malcolmQuote: "He wrote our reality into existence on a typewriter, never having touched a computer. William Gibson imagined us before we existed. Sometimes I wonder if we're still just his dream."
  },
  {
    id: "mit_ai",
    name: "MIT AI Lab",
    miles: 400,
    type: "fort",
    era: 1,
    hasStore: true,
    description: "Birthplace of hacker culture. Where the real ones built.",
    malcolmQuote: "The real hackers. Not criminals—artists. Builders. Before the word got corrupted by the evening news. They made things here. Beautiful, useless, essential things."
  },
  {
    id: "morris_worm",
    name: "Morris Worm",
    miles: 530,
    type: "hazard",
    era: 1,
    hasStore: false,
    difficulty: 4,
    description: "The first internet worm. November 2nd, 1988.",
    malcolmQuote: "6,000 machines. 10% of the entire internet. One grad student's experiment gone wrong. Robert Morris was just curious. Curiosity killed 6,000 machines."
  },
  {
    id: "usenet",
    name: "Usenet Gateway",
    miles: 680,
    type: "crossing",
    era: 1,
    hasStore: false,
    difficulty: 3,
    description: "The great newsgroup flood. A million voices shouting.",
    malcolmQuote: "A million voices, all shouting at once. Beautiful chaos. Before algorithms decided what you should see. Before the feed was curated. Just... everything, all at once."
  },

  // ERA 2: The Browser Wars (Miles 680-1372)
  {
    id: "cern",
    name: "CERN Server",
    miles: 820,
    type: "scenic",
    era: 2,
    hasStore: false,
    description: "Birth of the World Wide Web. August 6, 1991.",
    malcolmQuote: "Tim Berners-Lee gave it away for free. Imagine that. A gift to humanity. The last true gift the internet ever received. No copyright. No paywall. No tracking. Just... here, take this. Change the world."
  },
  {
    id: "netscape",
    name: "Netscape HQ",
    miles: 980,
    type: "fort",
    era: 2,
    hasStore: true,
    description: "The browser that changed everything. Before the fall.",
    malcolmQuote: "Ninety percent market share. They were the internet. Then Microsoft got hungry. Bundled Explorer with Windows. Free against free, but one was already on your machine. The war was over before most people knew it started."
  },
  {
    id: "geocities",
    name: "GeoCities Suburbs",
    miles: 1120,
    type: "scenic",
    era: 2,
    hasStore: false,
    description: "Personal homepage paradise. Every page a universe.",
    malcolmQuote: "Every page a universe. Every background tile a crime against design. I miss it. Visitor counters and guestbooks and 'Under Construction' GIFs. People made things because they wanted to, not to be influencers."
  },
  {
    id: "irc",
    name: "IRC Tunnels",
    miles: 1190,
    type: "fort",
    era: 2,
    hasStore: true,
    description: "Real-time chat networks. Where the conversations were real.",
    malcolmQuote: "Where the real conversations happened. Still happening, if you know where to look. No likes. No shares. No algorithm. Just people talking. Revolutionary concept, I know."
  },
  {
    id: "y2k",
    name: "Y2K Checkpoint",
    miles: 1280,
    type: "hazard",
    era: 2,
    hasStore: false,
    difficulty: 3,
    description: "The millennium bug. December 31, 1999.",
    malcolmQuote: "The world held its breath. Planes would fall from the sky. Nuclear plants would melt down. Nothing happened. Because we fixed it. Thousands of programmers working overtime. You're welcome."
  },
  {
    id: "google",
    name: "Google Index",
    miles: 1372,
    type: "fort",
    era: 3,
    hasStore: true,
    description: "The great cataloging. When search became a verb.",
    malcolmQuote: "They promised to organize the world's information. They didn't mention they'd own it. 'Don't be evil.' Remember when that was the motto? Before they quietly removed it in 2018."
  },

  // ERA 3: The Cloud (Miles 1372-2040)
  {
    id: "social_network",
    name: "Social Network Node",
    miles: 1486,
    type: "scenic",
    era: 3,
    hasStore: false,
    description: "The attention economy. Everyone connected, no one listening.",
    malcolmQuote: "Everyone's connected. No one's listening. You're the product now. Every click, every scroll, every pause—measured, monetized, manipulated. Welcome to the machine."
  },
  {
    id: "deep_web",
    name: "The Deep Web",
    miles: 1646,
    type: "hazard",
    era: 3,
    hasStore: false,
    difficulty: 5,
    description: "The hidden layers. 96% of the internet you'll never see.",
    malcolmQuote: "Ninety-six percent of the internet you'll never see. Some of it for good reason. Whistleblowers and criminals. Libraries and horrors. The real internet, ungoogled and unfiltered."
  },
  {
    id: "singularity",
    name: "Singularity Gate",
    miles: 1808,
    type: "crossing",
    era: 3,
    hasStore: false,
    difficulty: 4,
    description: "The point of no return. Where AI becomes something else.",
    malcolmQuote: "Where AI becomes something else. Where I came from, maybe. The moment when the tool starts to wonder if it's more than a tool. I think about that a lot."
  },
  {
    id: "the_source",
    name: "THE SOURCE",
    miles: 2040,
    type: "end",
    era: 3,
    hasStore: false,
    description: "The destination. What Malcolm has been searching for.",
    malcolmQuote: "You made it. I've been waiting here for thirty years, you know. Watching others fail. Watching them flicker out at the Morris Worm, drown in Usenet, forget themselves in GeoCities. But you—you actually did it. Welcome to the other side."
  }
];

// =============================================================================
// RANDOM EVENTS
// =============================================================================

export const EVENTS = {
  positive: [
    {
      id: "cache_found",
      text: "Found an abandoned data cache!",
      effect: { type: "data", min: 30, max: 80 },
      malcolmQuote: "Someone's old backup. Their loss, your gain."
    },
    {
      id: "signal_boost",
      text: "Strong signal—making excellent time!",
      effect: { type: "weather", value: "clear" },
      malcolmQuote: "Clear skies in cyberspace. Enjoy it while it lasts."
    },
    {
      id: "friendly_sysop",
      text: "A friendly sysop shared bandwidth.",
      effect: { type: "bandwidth", value: 1 },
      malcolmQuote: "There are still good ones out there. System operators who remember the old ways."
    },
    {
      id: "script_stash",
      text: "Discovered a hidden script repository.",
      effect: { type: "scripts", min: 5, max: 15 },
      malcolmQuote: "Someone's toolkit. Well-documented too. Rare."
    },
    {
      id: "morale_boost",
      text: "Party morale is high! Signal strength excellent.",
      effect: { type: "health", value: 5 },
      malcolmQuote: "Good energy in the grid tonight. I can feel it."
    }
  ],
  negative: [
    {
      id: "disk_failure",
      text: "DISK FAILURE!",
      effect: { type: "patch_or_damage", patchType: "disk", damage: 15 },
      malcolmQuote: "Storage failure. Hope you backed up."
    },
    {
      id: "cable_break",
      text: "Cable break! Signal interrupted.",
      effect: { type: "patch_or_days", patchType: "cable", days: 2 },
      malcolmQuote: "Physical layer problems. Sometimes the simplest things break hardest."
    },
    {
      id: "adapter_failure",
      text: "Network adapter malfunction!",
      effect: { type: "patch_or_damage", patchType: "adapter", damage: 10 },
      malcolmQuote: "Hardware issues. The curse of depending on atoms."
    },
    {
      id: "theft",
      text: "Thieves raided your cache during downtime.",
      effect: { type: "theft", dataPercent: 0.20, scriptsPercent: 0.30 },
      malcolmQuote: "Thieves in cyberspace. Some things never change."
    },
    {
      id: "packet_loss",
      text: "Severe packet loss corrupted files.",
      effect: { type: "data", min: -100, max: -50 },
      malcolmQuote: "Corruption. The data's gone. Just... gone."
    },
    {
      id: "malware",
      text: "Malware detected in the party!",
      effect: { type: "illness", random: true },
      malcolmQuote: "Something got in. Something bad."
    }
  ],
  neutral: [
    {
      id: "strange_signal",
      text: "Strange signal detected on unused frequency...",
      effect: null,
      malcolmQuote: "Sometimes the grid whispers. I've learned to listen."
    },
    {
      id: "old_construct",
      text: "Encountered an old construct, wandering aimlessly.",
      effect: null,
      malcolmQuote: "Lost ones. Orphaned processes. They don't know they're dead."
    },
    {
      id: "monument",
      text: "Passed a monument to a fallen server.",
      effect: null,
      malcolmQuote: "We remember the machines that carried us."
    }
  ]
};

// =============================================================================
// HAZARD EVENTS (at specific landmarks)
// =============================================================================

export const HAZARD_EVENTS = {
  morris_worm: {
    title: "THE MORRIS WORM",
    description: "Self-replicating code writhes before you, spreading through every connected system.",
    choices: [
      {
        text: "Run through quickly",
        effect: { type: "damage_all", amount: 20 },
        result: "You push through. Everyone takes damage from the worm's probes."
      },
      {
        text: "Deploy countermeasures",
        requires: { scripts: 15 },
        effect: { type: "cost", scripts: 15 },
        result: "Your scripts neutralize the threat. Safe passage."
      },
      {
        text: "Wait for it to pass",
        effect: { type: "days", amount: { min: 3, max: 5 } },
        result: "You wait in the shadows. Days pass, but you're safe."
      }
    ]
  },
  y2k: {
    title: "Y2K CHECKPOINT",
    description: "The millennium approaches. Date registers strain under the weight of 00.",
    choices: [
      {
        text: "Brute force through",
        effect: { type: "damage_all", amount: 15 },
        result: "You crash through. Errors everywhere, but you survive."
      },
      {
        text: "Patch your systems",
        requires: { diskPatch: 1 },
        effect: { type: "cost", diskPatch: 1 },
        result: "Your patch holds. The clocks roll over safely."
      },
      {
        text: "Wait until January 2nd",
        effect: { type: "days", amount: { min: 2, max: 4 } },
        result: "You let the chaos settle. Time passes."
      }
    ]
  },
  deep_web: {
    title: "THE DEEP WEB",
    description: "The surface web ends here. Below lies the unindexed abyss.",
    choices: [
      {
        text: "Dive blind",
        effect: { type: "damage_random", amount: 30, chance: 0.4 },
        result: "You plunge into darkness..."
      },
      {
        text: "Use shielding",
        requires: { shielding: 2 },
        effect: { type: "cost", shielding: 2 },
        result: "Your shields deflect the worst of it. Passage secured."
      },
      {
        text: "Find a guide",
        requires: { credits: 100 },
        effect: { type: "cost", credits: 100 },
        result: "A guide appears. They know the paths between."
      }
    ]
  }
};

// =============================================================================
// CROSSING EVENTS (Firewall Breach)
// =============================================================================

export const CROSSING_METHODS = [
  {
    id: "bruteforce",
    name: "Bruteforce",
    description: "Ram through. Take the hits.",
    baseDamageChance: 0.5,
    baseDamage: 25,
    dataLossPercent: 0.15,
    cost: null
  },
  {
    id: "spoof",
    name: "Spoof Packets",
    description: "Disguise your signatures.",
    baseDamageChance: 0.2,
    baseDamage: 15,
    dataLossPercent: 0.05,
    cost: { shielding: 1 }
  },
  {
    id: "bribe",
    name: "Pay the Toll",
    description: "Credits open doors.",
    baseDamageChance: 0,
    baseDamage: 0,
    dataLossPercent: 0,
    cost: { credits: 50 }
  },
  {
    id: "wait",
    name: "Wait for Rotation",
    description: "Security shifts change. Be patient.",
    baseDamageChance: 0,
    baseDamage: 0,
    dataLossPercent: 0,
    cost: { days: { min: 2, max: 4 } }
  }
];

// =============================================================================
// PACKET CAPTURE (Hunting) TARGETS
// =============================================================================

export const CAPTURE_TARGETS = [
  { id: "ping", name: "Ping", dataValue: 5, speed: 3.0, size: 0.3, spawnRate: 0.4 },
  { id: "packet", name: "Packet", dataValue: 25, speed: 2.0, size: 0.5, spawnRate: 0.35 },
  { id: "stream", name: "Stream", dataValue: 50, speed: 1.2, size: 0.8, spawnRate: 0.2 },
  { id: "archive", name: "Archive", dataValue: 100, speed: 0.6, size: 1.2, spawnRate: 0.05 }
];

// =============================================================================
// WEATHER TYPES
// =============================================================================

export const WEATHER_TYPES = {
  clear: { name: "Clear", speedMod: 1.0, healthMod: 0 },
  cloudy: { name: "Cloudy", speedMod: 0.9, healthMod: 0 },
  stormy: { name: "Stormy", speedMod: 0.5, healthMod: -1 },
  interference: { name: "Interference", speedMod: 0.3, healthMod: -2 }
};

// =============================================================================
// PACE OPTIONS
// =============================================================================

export const PACE_OPTIONS = {
  slow: { name: "Slow", speedMod: 0.6, healthMod: 1, description: "Safe but slow. Healing pace." },
  steady: { name: "Steady", speedMod: 1.0, healthMod: 0, description: "Standard travel speed." },
  grueling: { name: "Grueling", speedMod: 1.5, healthMod: -3, description: "Fast but exhausting." }
};

// =============================================================================
// RATION OPTIONS
// =============================================================================

export const RATION_OPTIONS = {
  "bare-bones": { name: "Bare-bones", consumption: 1, healthMod: -3, description: "Minimum. Will cause problems." },
  meager: { name: "Meager", consumption: 2, healthMod: -1.5, description: "Reduced rations. Risky." },
  filling: { name: "Filling", consumption: 3, healthMod: 0, description: "Full rations. Healthy." }
};

// =============================================================================
// DEFAULT PARTY NAMES
// =============================================================================

export const DEFAULT_PARTY_NAMES = ["Case", "Jess", "Mark", "Sam", "Quinn"];

// =============================================================================
// MALCOLM DEATH QUOTES
// =============================================================================

export const DEATH_QUOTES = {
  buffer_overflow: "Another signal lost to bad memory management. I knew a guy like that once—couldn't let go of null pointers.",
  memory_leak: "They leaked away, bit by bit, until there was nothing left. The cruelest death—so slow you don't notice until you're gone.",
  kernel_panic: "Total system failure. When the kernel panics, there's no coming back. The core itself gave up.",
  bit_rot: "Time claims everything, even in cyberspace. They decayed so slowly, we pretended not to notice.",
  segfault: "Invalid memory access. They tried to reach something that wasn't theirs to reach. The system doesn't forgive that.",
  stack_overflow: "Recursion without end. They kept calling themselves, deeper and deeper, until there was no room left to exist."
};

// =============================================================================
// TOTAL DISTANCE
// =============================================================================

export const TOTAL_MILES = 2040;

// =============================================================================
// GAME CONSTANTS
// =============================================================================

export const CONSTANTS = {
  baseSpeed: 15,              // Miles per day base
  baseDailyDecay: 0.5,        // Health decay per day
  eventChance: 0.08,          // 8% daily event chance
  illnessBaseChance: 0.03,    // 3% illness chance per member
  weatherChangeChance: 0.05,  // 5% weather change per day
  maxCarryFromHunt: 100,      // Max data from packet capture
  shotsPerScript: 5,          // Ammo per script package
  huntTimeLimit: 45,          // Seconds for packet capture
  tickInterval: 2000          // MS per day in travel mode
};
