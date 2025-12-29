/**
 * GRID_RUN - Simulation Engine
 * Core game logic: daily tick, health decay, distance, events
 */

import {
  LANDMARKS,
  ILLNESSES,
  EVENTS,
  WEATHER_TYPES,
  PACE_OPTIONS,
  RATION_OPTIONS,
  CONSTANTS,
  TOTAL_MILES,
  DEATH_QUOTES
} from './data.js';

// =============================================================================
// GAME STATE FACTORY
// =============================================================================

export function createGameState(profession, partyNames, startMonth) {
  return {
    // Meta
    profession: profession,
    day: 1,
    month: startMonth,
    year: 1969,
    status: "travel",

    // Travel
    milesTraveled: 0,
    totalMiles: TOTAL_MILES,
    currentLandmarkIndex: 0,
    pace: "steady",
    rations: "filling",
    weather: "clear",

    // Resources
    resources: {
      bandwidth: 4,
      data: 500,
      shielding: 5,
      scripts: 20,
      diskPatch: 2,
      cablePatch: 2,
      adapterPatch: 2
    },
    credits: 0,  // Set by profession

    // Party
    party: partyNames.map((name, i) => ({
      name: name,
      isLeader: i === 0,
      health: 100,
      alive: true,
      illness: null
    })),

    // Messages
    recentMessages: [],
    pendingEvent: null,
    daysSinceLastLandmark: 0
  };
}

// =============================================================================
// DAILY TICK - Main simulation step
// =============================================================================

export function dailyTick(state) {
  const messages = [];
  
  // 1. Consume resources (data per alive party member)
  const aliveCount = state.party.filter(m => m.alive).length;
  const consumption = RATION_OPTIONS[state.rations].consumption * aliveCount;
  state.resources.data = Math.max(0, state.resources.data - consumption);
  
  if (state.resources.data <= 0) {
    messages.push({ type: "danger", text: "OUT OF DATA! Party is starving!" });
  }

  // 2. Calculate distance traveled
  const milesThisDay = calculateDailyMiles(state);
  state.milesTraveled = Math.min(TOTAL_MILES, state.milesTraveled + milesThisDay);
  state.daysSinceLastLandmark++;

  // 3. Update party health
  const healthMessages = updatePartyHealth(state);
  messages.push(...healthMessages);

  // 4. Roll for weather change
  if (Math.random() < CONSTANTS.weatherChangeChance) {
    const newWeather = rollWeather(state);
    if (newWeather !== state.weather) {
      state.weather = newWeather;
      messages.push({ type: "info", text: `Weather changed to ${WEATHER_TYPES[newWeather].name}.` });
    }
  }

  // 5. Roll for random event
  if (Math.random() < CONSTANTS.eventChance && !state.pendingEvent) {
    const event = rollRandomEvent(state);
    if (event) {
      state.pendingEvent = event;
    }
  }

  // 6. Roll for illness
  const illnessMessages = rollForIllness(state);
  messages.push(...illnessMessages);

  // 7. Check for deaths
  const deathMessages = checkForDeaths(state);
  messages.push(...deathMessages);

  // 8. Check for landmark reached
  const landmarkReached = checkLandmarkReached(state);
  if (landmarkReached) {
    messages.push({ type: "landmark", text: `Arrived at ${landmarkReached.name}!`, landmark: landmarkReached });
  }

  // 9. Advance day
  state.day++;
  advanceCalendar(state);

  // 10. Check game over conditions
  const leader = state.party.find(m => m.isLeader);
  const allDead = state.party.every(m => !m.alive);
  
  if (!leader.alive || allDead) {
    state.status = "dead";
    messages.push({ type: "gameover", text: "Your party has been de-rezzed." });
  }

  // 11. Check victory
  if (state.milesTraveled >= TOTAL_MILES) {
    state.status = "victory";
    messages.push({ type: "victory", text: "You have reached THE SOURCE!" });
  }

  state.recentMessages = messages;
  return messages;
}

// =============================================================================
// DISTANCE CALCULATION
// =============================================================================

function calculateDailyMiles(state) {
  const baseSpeed = CONSTANTS.baseSpeed;
  const paceMultiplier = PACE_OPTIONS[state.pace].speedMod;
  const bandwidthMultiplier = 0.8 + (state.resources.bandwidth / 10) * 0.4;
  const weatherMultiplier = WEATHER_TYPES[state.weather].speedMod;
  const randomFactor = 0.8 + Math.random() * 0.4;
  
  // If out of data, halve speed
  const starvingMod = state.resources.data <= 0 ? 0.5 : 1.0;
  
  return Math.floor(baseSpeed * paceMultiplier * bandwidthMultiplier * weatherMultiplier * randomFactor * starvingMod);
}

// =============================================================================
// HEALTH UPDATE
// =============================================================================

function updatePartyHealth(state) {
  const messages = [];
  const baseDecay = CONSTANTS.baseDailyDecay;
  const rationPenalty = RATION_OPTIONS[state.rations].healthMod;
  const pacePenalty = PACE_OPTIONS[state.pace].healthMod;
  const weatherPenalty = WEATHER_TYPES[state.weather].healthMod;
  const starvingPenalty = state.resources.data <= 0 ? -5 : 0;

  for (const member of state.party) {
    if (!member.alive) continue;

    const illnessPenalty = member.illness ? -member.illness.severity : 0;
    
    // Calculate health change (positive healthMod = healing)
    let healthChange = pacePenalty + rationPenalty + weatherPenalty + illnessPenalty + starvingPenalty - baseDecay;
    
    // Shielding provides some protection
    if (state.resources.shielding > 0 && healthChange < 0) {
      healthChange = healthChange * 0.8;
    }

    member.health = Math.max(0, Math.min(100, member.health + healthChange));

    // 5% chance per day to recover from illness if health > 60
    if (member.illness && member.health > 60 && Math.random() < 0.05) {
      messages.push({ type: "success", text: `${member.name} recovered from ${member.illness.name}!` });
      member.illness = null;
    }
  }

  return messages;
}

// =============================================================================
// WEATHER SYSTEM
// =============================================================================

function rollWeather(state) {
  const roll = Math.random();
  
  // Era affects weather probability
  const currentLandmark = LANDMARKS[state.currentLandmarkIndex];
  const era = currentLandmark ? currentLandmark.era : 1;
  
  if (era === 1) {
    // Primordial: mostly clear, some interference
    if (roll < 0.5) return "clear";
    if (roll < 0.75) return "cloudy";
    if (roll < 0.9) return "stormy";
    return "interference";
  } else if (era === 2) {
    // Browser Wars: chaotic
    if (roll < 0.3) return "clear";
    if (roll < 0.6) return "cloudy";
    if (roll < 0.85) return "stormy";
    return "interference";
  } else {
    // Cloud: controlled but harsh
    if (roll < 0.4) return "clear";
    if (roll < 0.7) return "cloudy";
    if (roll < 0.9) return "stormy";
    return "interference";
  }
}

// =============================================================================
// RANDOM EVENTS
// =============================================================================

function rollRandomEvent(state) {
  // Determine event type weights based on party health
  const avgHealth = state.party.filter(m => m.alive).reduce((sum, m) => sum + m.health, 0) / 
                    state.party.filter(m => m.alive).length;
  
  let positiveWeight = avgHealth > 70 ? 0.4 : 0.2;
  let negativeWeight = avgHealth < 50 ? 0.5 : 0.3;
  let neutralWeight = 1 - positiveWeight - negativeWeight;
  
  const roll = Math.random();
  let eventType;
  
  if (roll < positiveWeight) {
    eventType = 'positive';
  } else if (roll < positiveWeight + negativeWeight) {
    eventType = 'negative';
  } else {
    eventType = 'neutral';
  }
  
  const events = EVENTS[eventType];
  const event = events[Math.floor(Math.random() * events.length)];
  
  return { ...event, eventType };
}

// =============================================================================
// APPLY EVENT EFFECTS
// =============================================================================

export function applyEventEffect(state, event) {
  const messages = [];
  const effect = event.effect;
  
  if (!effect) {
    messages.push({ type: "info", text: event.text });
    return messages;
  }

  switch (effect.type) {
    case "data":
      if (effect.min !== undefined) {
        const amount = Math.floor(Math.random() * (effect.max - effect.min + 1)) + effect.min;
        state.resources.data = Math.max(0, state.resources.data + amount);
        messages.push({ type: amount > 0 ? "success" : "danger", text: `${amount > 0 ? '+' : ''}${amount} data.` });
      }
      break;
      
    case "weather":
      state.weather = effect.value;
      messages.push({ type: "success", text: `Weather is now ${WEATHER_TYPES[effect.value].name}.` });
      break;
      
    case "bandwidth":
      state.resources.bandwidth = Math.min(10, state.resources.bandwidth + effect.value);
      messages.push({ type: "success", text: `+${effect.value} bandwidth channel.` });
      break;
      
    case "scripts":
      if (effect.min !== undefined) {
        const amount = Math.floor(Math.random() * (effect.max - effect.min + 1)) + effect.min;
        state.resources.scripts += amount;
        messages.push({ type: "success", text: `+${amount} scripts.` });
      }
      break;
      
    case "health":
      state.party.filter(m => m.alive).forEach(m => {
        m.health = Math.min(100, m.health + effect.value);
      });
      messages.push({ type: "success", text: `All party members +${effect.value} health.` });
      break;
      
    case "patch_or_damage":
      const patchKey = effect.patchType + "Patch";
      if (state.resources[patchKey] > 0) {
        state.resources[patchKey]--;
        messages.push({ type: "warning", text: `Used a ${effect.patchType} patch for repairs.` });
      } else {
        state.party.filter(m => m.alive).forEach(m => {
          m.health = Math.max(0, m.health - effect.damage);
        });
        messages.push({ type: "danger", text: `No ${effect.patchType} patch! All members -${effect.damage} health.` });
      }
      break;
      
    case "patch_or_days":
      const patchKey2 = effect.patchType + "Patch";
      if (state.resources[patchKey2] > 0) {
        state.resources[patchKey2]--;
        messages.push({ type: "warning", text: `Used a ${effect.patchType} patch for repairs.` });
      } else {
        state.day += effect.days;
        messages.push({ type: "warning", text: `No ${effect.patchType} patch! Lost ${effect.days} days.` });
      }
      break;
      
    case "theft":
      const dataLoss = Math.floor(state.resources.data * effect.dataPercent);
      const scriptLoss = Math.floor(state.resources.scripts * effect.scriptsPercent);
      state.resources.data = Math.max(0, state.resources.data - dataLoss);
      state.resources.scripts = Math.max(0, state.resources.scripts - scriptLoss);
      messages.push({ type: "danger", text: `Lost ${dataLoss} data and ${scriptLoss} scripts!` });
      break;
      
    case "illness":
      const aliveMembers = state.party.filter(m => m.alive && !m.illness);
      if (aliveMembers.length > 0) {
        const victim = aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
        const illness = ILLNESSES[Math.floor(Math.random() * ILLNESSES.length)];
        victim.illness = { ...illness };
        messages.push({ type: "danger", text: `${victim.name} ${illness.message}!` });
      }
      break;
  }
  
  return messages;
}

// =============================================================================
// ILLNESS ROLLS
// =============================================================================

function rollForIllness(state) {
  const messages = [];
  
  for (const member of state.party) {
    if (!member.alive || member.illness) continue;
    
    let chance = CONSTANTS.illnessBaseChance;
    
    // Modifiers
    if (member.health < 50) chance += 0.02;
    if (state.rations === "bare-bones") chance += 0.02;
    if (state.weather === "stormy") chance += 0.02;
    if (state.resources.shielding <= 0) chance += 0.02;
    
    // Near hazard landmarks
    const nextLandmark = LANDMARKS[state.currentLandmarkIndex + 1];
    if (nextLandmark && nextLandmark.type === "hazard") {
      const distToHazard = nextLandmark.miles - state.milesTraveled;
      if (distToHazard < 50) chance += 0.03;
    }
    
    if (Math.random() < chance) {
      const illness = ILLNESSES[Math.floor(Math.random() * ILLNESSES.length)];
      member.illness = { ...illness };
      messages.push({ 
        type: "danger", 
        text: `${member.name} ${illness.message}!`,
        malcolmQuote: illness.malcolmQuote
      });
    }
  }
  
  return messages;
}

// =============================================================================
// DEATH CHECK
// =============================================================================

function checkForDeaths(state) {
  const messages = [];
  
  for (const member of state.party) {
    if (!member.alive) continue;
    
    if (member.health <= 0) {
      member.alive = false;
      const cause = member.illness ? member.illness.name : "exhaustion";
      const quote = member.illness ? DEATH_QUOTES[member.illness.id] : "Some signals just fade away.";
      
      messages.push({
        type: "death",
        text: `${member.name} has died of ${cause}.`,
        member: member.name,
        cause: cause,
        malcolmQuote: quote,
        isLeader: member.isLeader
      });
    }
  }
  
  return messages;
}

// =============================================================================
// LANDMARK CHECK
// =============================================================================

function checkLandmarkReached(state) {
  const nextIndex = state.currentLandmarkIndex + 1;
  if (nextIndex >= LANDMARKS.length) return null;
  
  const nextLandmark = LANDMARKS[nextIndex];
  if (state.milesTraveled >= nextLandmark.miles) {
    state.currentLandmarkIndex = nextIndex;
    state.daysSinceLastLandmark = 0;
    return nextLandmark;
  }
  
  return null;
}

// =============================================================================
// CALENDAR ADVANCEMENT
// =============================================================================

function advanceCalendar(state) {
  // Simple month advancement (30 days per month)
  if (state.day > 30) {
    state.day = 1;
    state.month++;
    
    if (state.month > 12) {
      state.month = 1;
      state.year++;
    }
  }
}

// =============================================================================
// UTILITY: GET NEXT LANDMARK
// =============================================================================

export function getNextLandmark(state) {
  const nextIndex = state.currentLandmarkIndex + 1;
  if (nextIndex >= LANDMARKS.length) return null;
  return LANDMARKS[nextIndex];
}

// =============================================================================
// UTILITY: GET CURRENT LANDMARK
// =============================================================================

export function getCurrentLandmark(state) {
  return LANDMARKS[state.currentLandmarkIndex];
}

// =============================================================================
// UTILITY: DISTANCE TO NEXT LANDMARK
// =============================================================================

export function distanceToNextLandmark(state) {
  const next = getNextLandmark(state);
  if (!next) return 0;
  return next.miles - state.milesTraveled;
}

// =============================================================================
// UTILITY: CALCULATE FINAL SCORE
// =============================================================================

export function calculateScore(state, profession) {
  let score = 0;
  
  // Points per survivor (100 per person, 200 for leader)
  for (const member of state.party) {
    if (member.alive) {
      score += member.isLeader ? 200 : 100;
    }
  }
  
  // Points for remaining resources
  score += Math.floor(state.resources.data / 5);
  score += state.resources.bandwidth * 10;
  score += state.resources.shielding * 5;
  score += state.resources.scripts * 2;
  score += Math.floor(state.credits / 2);
  
  // Speed bonus (max 200 for finishing fast)
  const daysElapsed = (state.year - 1969) * 365 + (state.month - 3) * 30 + state.day;
  if (daysElapsed < 120) {
    score += Math.floor((120 - daysElapsed) * 2);
  }
  
  // Apply profession multiplier
  const { PROFESSIONS } = require('./data.js');
  const multiplier = PROFESSIONS[profession].multiplier;
  
  return Math.floor(score * multiplier);
}

// =============================================================================
// PURCHASE HELPER
// =============================================================================

export function canAfford(state, item, quantity, prices) {
  const cost = prices[item] * quantity;
  return state.credits >= cost;
}

export function purchaseItem(state, item, quantity, prices) {
  const cost = prices[item] * quantity;
  if (state.credits < cost) return false;
  
  state.credits -= cost;
  
  if (item === "bandwidth") {
    state.resources.bandwidth = Math.min(10, state.resources.bandwidth + quantity);
  } else if (item in state.resources) {
    state.resources[item] += quantity;
  }
  
  return true;
}

// =============================================================================
// REST HELPER
// =============================================================================

export function restParty(state, days = 1) {
  for (let d = 0; d < days; d++) {
    // Consume data but give health
    const aliveCount = state.party.filter(m => m.alive).length;
    state.resources.data = Math.max(0, state.resources.data - aliveCount * 3);
    
    for (const member of state.party) {
      if (!member.alive) continue;
      
      // Healing during rest
      let heal = 5;
      if (member.illness) heal = 2; // Less healing when sick
      member.health = Math.min(100, member.health + heal);
      
      // Chance to recover from illness
      if (member.illness && Math.random() < 0.15) {
        member.illness = null;
      }
    }
    
    state.day++;
    advanceCalendar(state);
  }
}
