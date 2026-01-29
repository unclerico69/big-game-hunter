import type { Tv, Game } from "@shared/schema";
import { isProtectedEndgame as checkProtectedEndgame } from "./hotness";

/**
 * Anti-Thrash TV Auto-Assignment Engine
 * 
 * Prevents rapid channel switching while still allowing important games
 * to take over when they become significantly more compelling.
 */

// Configuration
const AUTO_LOCK_DURATION_MS = 8 * 60 * 1000; // 8 minutes
const HOTNESS_DELTA_THRESHOLD = 15;

export interface SwitchDecision {
  shouldSwitch: boolean;
  reason: string;
  currentGameId: number | null;
  challengerGameId: number;
}

export interface GameWithHotness extends Game {
  hotness: number;
  isProtectedEndgame?: boolean;
  timeRemaining?: number;
  currentInning?: number;
  isOvertime?: boolean;
  isWalkOffPotential?: boolean;
}

/**
 * Wrapper for isProtectedEndgame that handles GameWithHotness type
 */
function isProtectedEndgame(game: GameWithHotness): boolean {
  return checkProtectedEndgame({
    league: game.league,
    status: game.status || 'Live',
    timeRemaining: game.timeRemaining,
    currentInning: game.currentInning,
    isOvertime: game.isOvertime,
    isWalkOffPotential: game.isWalkOffPotential
  });
}

/**
 * Determines if a TV has an active manual lock
 */
function hasManualLock(tv: Tv): boolean {
  if (!tv.lockedUntil) return false;
  return new Date(tv.lockedUntil) > new Date();
}

/**
 * Determines if a TV has an active auto-lock
 */
function hasAutoLock(tv: Tv): boolean {
  if (!tv.autoLockUntil) return false;
  return new Date(tv.autoLockUntil) > new Date();
}

/**
 * Main decision function for automatic TV switching
 * 
 * Decision Flow (in order):
 * 1. If manual lock active → KEEP
 * 2. If current game is protected endgame → KEEP
 * 3. If auto lock active → KEEP (unless challenger is exceptional)
 * 4. If challenger hotness < current hotness + delta → KEEP
 * 5. Otherwise → SWITCH
 */
export function shouldSwitchGame(
  tv: Tv,
  currentGame: GameWithHotness | null,
  challenger: GameWithHotness,
  enableLogging = false
): SwitchDecision {
  const tvId = tv.id;
  const currentGameId = currentGame?.id ?? null;
  const challengerGameId = challenger.id;
  
  // Fail-safe: KEEP if challenger hotness is missing
  if (challenger.hotness === undefined || challenger.hotness === null) {
    if (enableLogging) {
      console.log(`[AutoAssign] TV=${tvId} KEEP (Missing challenger data)`);
    }
    return {
      shouldSwitch: false,
      reason: "Missing challenger data",
      currentGameId,
      challengerGameId
    };
  }
  
  // Helper for logging (matches spec format exactly)
  const log = (action: string, reason: string) => {
    if (enableLogging) {
      console.log(`[AutoAssign] TV=${tvId} ${action} (${reason})`);
    }
  };
  
  // 1. Manual lock check
  if (hasManualLock(tv)) {
    log('KEEP', 'Manual lock active');
    return {
      shouldSwitch: false,
      reason: "Manual lock active",
      currentGameId,
      challengerGameId
    };
  }
  
  // 2. Endgame protection
  if (currentGame && isProtectedEndgame(currentGame)) {
    log('KEEP', 'Endgame protection');
    return {
      shouldSwitch: false,
      reason: "Endgame protection",
      currentGameId,
      challengerGameId
    };
  }
  
  // 3. Auto-lock check (with exceptions)
  if (hasAutoLock(tv)) {
    // Exception: Challenger is extremely hot (≥90)
    if (challenger.hotness >= 90) {
      log('SWITCH', `Hotness override (${challenger.hotness})`);
      return {
        shouldSwitch: true,
        reason: `Hotness override (${challenger.hotness})`,
        currentGameId,
        challengerGameId
      };
    }
    
    // Exception: Challenger is in protected endgame, current is not
    if (isProtectedEndgame(challenger) && currentGame && !isProtectedEndgame(currentGame)) {
      log('SWITCH', 'Challenger endgame priority');
      return {
        shouldSwitch: true,
        reason: "Challenger endgame priority",
        currentGameId,
        challengerGameId
      };
    }
    
    log('KEEP', 'Auto-lock active');
    return {
      shouldSwitch: false,
      reason: "Auto-lock active",
      currentGameId,
      challengerGameId
    };
  }
  
  // 4. Hotness delta check
  const currentHotness = currentGame?.hotness ?? 0;
  const hotnessDelta = challenger.hotness - currentHotness;
  
  if (hotnessDelta < HOTNESS_DELTA_THRESHOLD) {
    log('KEEP', 'Hotness delta not met');
    return {
      shouldSwitch: false,
      reason: "Hotness delta not met",
      currentGameId,
      challengerGameId
    };
  }
  
  // 5. Allow switch
  const switchReason = `Hotness +${hotnessDelta}`;
  log('SWITCH', switchReason);
  return {
    shouldSwitch: true,
    reason: switchReason,
    currentGameId,
    challengerGameId
  };
}

/**
 * Calculates the auto-lock expiration time
 */
export function calculateAutoLockUntil(): Date {
  return new Date(Date.now() + AUTO_LOCK_DURATION_MS);
}

/**
 * Prepares TV update fields for an automatic assignment
 */
export function prepareAutoAssignUpdate(gameId: number, channel: string): {
  currentGameId: number;
  currentChannel: string;
  assignedAt: Date;
  autoLockUntil: Date;
} {
  const now = new Date();
  return {
    currentGameId: gameId,
    currentChannel: channel,
    assignedAt: now,
    autoLockUntil: new Date(now.getTime() + AUTO_LOCK_DURATION_MS)
  };
}

export const AUTO_ASSIGN_CONFIG = {
  AUTO_LOCK_DURATION_MS,
  HOTNESS_DELTA_THRESHOLD
};
