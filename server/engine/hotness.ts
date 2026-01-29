import { TEAMS } from "../../shared/data/teams";

export interface HotnessResult {
  score: number;
  reasons: string[];
}

export interface GameState {
  league: string;
  status: string;
  timeRemaining?: number;
  currentInning?: number;
  isOvertime?: boolean;
  isWalkOffPotential?: boolean;
}

/**
 * Determines if a game is in a protected endgame state
 * Based on sport-specific rules - used by auto-assign engine
 */
export function isProtectedEndgame(game: GameState): boolean {
  if (game.isOvertime) return true;
  
  const league = game.league;
  const timeRemaining = game.timeRemaining;
  const currentInning = game.currentInning;
  
  // Football (NFL / NCAA_FB) - Final 5 minutes or OT
  if (league === 'NFL' || league === 'NCAA_FB') {
    if (timeRemaining !== undefined && timeRemaining <= 300) return true;
  }
  
  // Basketball (NBA / NCAA_MBB / NCAA_WBB) - Final 2 minutes or OT
  if (league === 'NBA' || league === 'NCAA_MBB' || league === 'NCAA_WBB') {
    if (timeRemaining !== undefined && timeRemaining <= 120) return true;
  }
  
  // Hockey (NHL) - Final 5 minutes or OT
  if (league === 'NHL') {
    if (timeRemaining !== undefined && timeRemaining <= 300) return true;
  }
  
  // Baseball (MLB) - 8th inning or later, or walk-off situation
  if (league === 'MLB') {
    if (currentInning !== undefined && currentInning >= 8) return true;
    if (game.isWalkOffPotential) return true;
  }
  
  return false;
}

/**
 * Sport-Specific Pacing Profiles
 * 
 * Each sport has different game dynamics:
 * - Football: Long plays, clock management in final 5 minutes
 * - Basketball: Fast pace, drama in final 3 minutes
 * - Hockey: Low scoring, entire 3rd period matters
 * - Baseball: Inning-based, late innings (7+) are crucial
 */
interface TimedPacingProfile {
  lateGameWindow: number;    // seconds remaining for "late game"
  timeMultiplier: number;    // multiplier for time pressure bonus
  closeGameThreshold: number; // point difference for "close game"
}

interface InningPacingProfile {
  lateInning: number;        // inning number for "late game"
  inningMultiplier: number;  // multiplier for late inning bonus
  closeGameThreshold: number; // run difference for "close game"
}

type PacingProfile = TimedPacingProfile | InningPacingProfile;

const pacingProfiles: Record<string, PacingProfile> = {
  // Football - clock management, 5 min late game window
  NFL: { lateGameWindow: 300, timeMultiplier: 1.4, closeGameThreshold: 8 },
  NCAA_FB: { lateGameWindow: 300, timeMultiplier: 1.4, closeGameThreshold: 8 },

  // Basketball - fast pace, 3 min late game window
  NBA: { lateGameWindow: 180, timeMultiplier: 1.1, closeGameThreshold: 6 },
  NCAA_MBB: { lateGameWindow: 180, timeMultiplier: 1.1, closeGameThreshold: 6 },
  NCAA_WBB: { lateGameWindow: 180, timeMultiplier: 1.1, closeGameThreshold: 6 },

  // Hockey - low scoring, 10 min late game window (entire 3rd period)
  NHL: { lateGameWindow: 600, timeMultiplier: 1.3, closeGameThreshold: 1 },

  // Baseball - inning-based urgency
  MLB: { lateInning: 7, inningMultiplier: 1.2, closeGameThreshold: 2 }
};

function isInningBased(profile: PacingProfile): profile is InningPacingProfile {
  return 'lateInning' in profile;
}

function getProfile(leagueId: string): PacingProfile {
  return pacingProfiles[leagueId] || pacingProfiles.NFL; // Default to NFL pacing
}

/**
 * Get sport-friendly name for display
 */
function getLeagueDisplayName(leagueId: string): string {
  const names: Record<string, string> = {
    NFL: "NFL",
    NCAA_FB: "college football",
    NBA: "NBA",
    NCAA_MBB: "college basketball",
    NCAA_WBB: "women's college basketball",
    NHL: "NHL",
    MLB: "MLB"
  };
  return names[leagueId] || leagueId;
}

/**
 * New Hotness Algorithm (Simple, Expressive, Sport-Aware)
 * 
 * Step 1: Zero the Baseline - hotness = 0
 * Step 2: Status Gate - Scheduled games capped at 40
 * Step 3: Live Game Core - Live adds +25
 * Step 4: Score Tension - Sport-specific close game thresholds
 * Step 5: Time Pressure - Sport-specific late game windows
 * Step 6: Overtime Override - OT = 100
 * Step 7: Crowd Signal - +12 per TV watching
 * Step 8: Clamp to 100
 */
export function computeBaseHotnessWithReasons(game: any, enableLogging = false): HotnessResult {
  let hotness = 0;
  const reasons: string[] = [];
  
  const leagueId = game.leagueId || game.league || 'NFL';
  const profile = getProfile(leagueId);
  const sportName = getLeagueDisplayName(leagueId);

  // Step 1: Zero the Baseline
  // No league, no preference, no hype yet.

  // Step 2: Status Gate (Critical)
  // Scheduled games can never exceed 40
  if (game.status === "Scheduled" || game.status === "Upcoming") {
    const now = new Date();
    const startTime = new Date(game.startTime);
    const timeUntilStart = (startTime.getTime() - now.getTime()) / 1000; // seconds

    let result: HotnessResult;
    if (timeUntilStart > 60 * 60) {
      result = { score: 10, reasons: ["Scheduled (>1hr away)"] };
    } else if (timeUntilStart > 30 * 60) {
      result = { score: 20, reasons: ["Starting within the hour"] };
    } else if (timeUntilStart > 10 * 60) {
      result = { score: 30, reasons: ["Starting soon"] };
    } else {
      result = { score: 40, reasons: ["About to start"] };
    }
    
    if (enableLogging) {
      console.log(`[Hotness] league=${leagueId} status=${game.status} hotness=${result.score}`);
    }
    return result;
  }

  // Step 3: Live Game Core
  if (game.status === "Live") {
    hotness += 25;
    reasons.push(`Live ${sportName} game`);
  }

  // Step 4: Score Tension (Sport-Specific)
  const scoreDiff = game.scoreDiff;
  const closeThreshold = profile.closeGameThreshold;
  
  if (scoreDiff !== null && scoreDiff !== undefined) {
    // Tiered scoring based on sport-specific threshold
    if (scoreDiff <= closeThreshold * 3) {
      hotness += 10;
    }
    if (scoreDiff <= closeThreshold * 2) {
      hotness += 15;
      reasons.push(`Close ${sportName} game`);
    }
    if (scoreDiff <= closeThreshold) {
      hotness += 25;
      if (leagueId === 'NHL') {
        reasons.push("One-goal game");
      } else if (leagueId === 'MLB') {
        reasons.push("Tight ballgame");
      } else {
        reasons.push("Nail-biter");
      }
    }
  }

  // Step 5: Time Pressure (Sport-Specific)
  if (isInningBased(profile)) {
    // MLB: Inning-based urgency
    const currentInning = game.currentInning || game.period || 1;
    if (currentInning >= profile.lateInning) {
      const inningBonus = Math.round(15 * profile.inningMultiplier);
      hotness += inningBonus;
      if (currentInning >= 9) {
        const ninthBonus = Math.round(20 * profile.inningMultiplier);
        hotness += ninthBonus;
        reasons.push("Late-inning baseball drama");
      } else {
        reasons.push(`${currentInning}th inning stretch`);
      }
    }
  } else {
    // Time-based sports (Football, Basketball, Hockey)
    const timeRemaining = game.timeRemaining;
    if (timeRemaining !== null && timeRemaining !== undefined) {
      const timedProfile = profile as TimedPacingProfile;
      
      // Outer window: approaching late game
      if (timeRemaining < timedProfile.lateGameWindow * 3) {
        const earlyBonus = Math.round(10 * timedProfile.timeMultiplier);
        hotness += earlyBonus;
        
        if (leagueId === 'NHL') {
          reasons.push("3rd period intensity");
        } else if (leagueId === 'NFL' || leagueId === 'NCAA_FB') {
          reasons.push("4th quarter");
        } else {
          reasons.push("Late in game");
        }
      }
      
      // Inner window: crunch time
      if (timeRemaining < timedProfile.lateGameWindow) {
        const lateBonus = Math.round(20 * timedProfile.timeMultiplier);
        hotness += lateBonus;
        
        if (leagueId === 'NFL' || leagueId === 'NCAA_FB') {
          reasons.push("Final minutes of football game");
        } else if (leagueId === 'NHL') {
          reasons.push("Close NHL game late");
        } else {
          reasons.push("Crunch time");
        }
      }
    }
  }

  // Step 6: Overtime / Endgame Overrides
  if (game.isOvertime === true) {
    hotness = 100;
    reasons.length = 0;
    if (leagueId === 'MLB') {
      reasons.push("Extra innings");
    } else {
      reasons.push("Overtime");
    }
  }
  
  // Walk-off potential (MLB specific)
  if (leagueId === 'MLB' && game.isWalkOffPotential === true) {
    hotness = 100;
    reasons.length = 0;
    reasons.push("Walk-off situation");
  }

  // Step 7: Crowd Signal
  const assignedCount = game.assignedTvCount || 0;
  if (assignedCount > 0) {
    hotness += assignedCount * 12;
    reasons.push(`${assignedCount} TVs watching`);
  }

  // Step 8: Clamp
  const finalScore = Math.min(hotness, 100);
  
  if (enableLogging) {
    console.log(`[Hotness] league=${leagueId} scoreDiff=${scoreDiff ?? 'N/A'} timeRemaining=${game.timeRemaining ?? 'N/A'} hotness=${finalScore}`);
  }
  
  return {
    score: finalScore,
    reasons
  };
}

/**
 * Legacy function - returns just the score
 */
export function computeBaseHotness(game: any): number {
  return computeBaseHotnessWithReasons(game).score;
}

/**
 * Computes the final hotness score.
 * Hotness is now purely score-driven (game state only).
 * Preferences affect relevance, not hotness.
 * Returns a rounded integer between 0 and 100.
 */
export function computeFinalHotness(game: any, _preferences: any): number {
  return computeBaseHotness(game);
}

export function computeHotness(game: any): number {
  return computeBaseHotness(game);
}
