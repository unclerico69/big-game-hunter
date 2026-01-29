import { Request, Response } from "express";
import { storage } from "../storage";
import { calculateRelevance } from "../engine/relevance";
import { computeBaseHotnessWithReasons } from "../engine/hotness";
import { fetchLiveGames } from "../integrations/oddsApi";
import { fetchProScores } from "../services/proScoresApi";
import { fetchNcaaScores } from "../services/ncaaScoresApi";

/**
 * Match a score from external services to a base game
 * Accepts either Odds API format (homeTeam/awayTeam) or DB format (teamA/teamB)
 */
function findMatchingScore(game: any, scores: any[], logFailures: boolean = false): any | null {
  const startTime = new Date(game.startTime).getTime();
  const thirtyMinutes = 30 * 60 * 1000;
  
  // Normalize team names - support both Odds API (homeTeam/awayTeam) and DB (teamA/teamB)
  const gameHome = (game.homeTeam || game.teamA || "").toLowerCase();
  const gameAway = (game.awayTeam || game.teamB || "").toLowerCase();
  const gameLeague = (game.league || "").toUpperCase();

  const match = scores.find(s => {
    const sTime = new Date(s.startTime).getTime();
    const timeMatch = Math.abs(startTime - sTime) <= thirtyMinutes;
    const leagueMatch = s.league.toUpperCase() === gameLeague;
    
    const sHome = s.homeTeam.toLowerCase();
    const sAway = s.awayTeam.toLowerCase();
    
    const homeMatch = sHome.includes(gameHome) || gameHome.includes(sHome);
    const awayMatch = sAway.includes(gameAway) || gameAway.includes(sAway);
    
    // Also check reversed (in case home/away are swapped)
    const reversedMatch = (sHome.includes(gameAway) || gameAway.includes(sHome)) &&
                          (sAway.includes(gameHome) || gameHome.includes(sAway));

    return timeMatch && leagueMatch && (homeMatch && awayMatch || reversedMatch);
  });

  // Log when score matching fails for live games
  if (!match && logFailures && game.isLive) {
    console.log(`[Scores] Match failed for: ${gameHome} vs ${gameAway} (${gameLeague})`);
  }

  return match || null;
}

/**
 * GET /api/live-games
 * Returns a list of games with relevance scores, hotness scores, and broadcast network info.
 */
export async function getLiveGames(req: Request, res: Response) {
  try {
    const mockGames = await storage.getGames();
    const prefs = await storage.getPreferences();
    const stats = await storage.getPlatformStats();
    
    // Fetch all data in parallel
    const [externalGames, proScores, ncaaScores] = await Promise.all([
      fetchLiveGames(),
      fetchProScores(),
      fetchNcaaScores()
    ]);
    
    const allScores = [...proScores, ...ncaaScores];
    let sourceData = externalGames.length > 0 ? externalGames : [];

    // Track enrichment stats
    let proGamesEnriched = 0;
    let ncaaGamesEnriched = 0;
    let gamesWithLiveScores = 0;

    // Process Pro Games from Odds API
    const now = new Date();
    const proGamesProcessed = await Promise.all(sourceData.map(async (eg) => {
      const startTime = new Date(eg.startTime);
      const hasStarted = startTime <= now;
      
      const title = `${eg.homeTeam} vs ${eg.awayTeam}`;
      const existingGames = await storage.getGames();
      
      let dbGame = existingGames.find(g => 
        g.title === title && 
        Math.abs(g.startTime.getTime() - startTime.getTime()) < 60000
      );
      
      // Match with real-time scores
      const scoreData = findMatchingScore(eg, allScores, true);
      const status = scoreData ? scoreData.status : (hasStarted && eg.isLive ? "Live" : "Upcoming");
      
      if (scoreData) {
        proGamesEnriched++;
        if (status === "Live") gamesWithLiveScores++;
      }

      if (!dbGame) {
        dbGame = await storage.createGame({
          title,
          teamA: eg.homeTeam,
          teamB: eg.awayTeam,
          league: eg.league,
          channel: eg.broadcastNetwork || "Unknown",
          startTime,
          status,
          relevance: 0,
          assignedTvCount: 0
        });
      } else if (dbGame.status !== status) {
        await storage.updateGameStatus(dbGame.id, status);
        dbGame.status = status;
      }

      return {
        ...dbGame,
        broadcastNetwork: eg.broadcastNetwork,
        homeScore: scoreData?.homeScore ?? null,
        awayScore: scoreData?.awayScore ?? null,
        scoreDiff: scoreData ? Math.abs(scoreData.homeScore - scoreData.awayScore) : null,
        timeRemaining: scoreData?.timeRemaining ?? null,
        period: scoreData?.period ?? null,
        isOvertime: scoreData?.isOvertime ?? false,
        isCollege: scoreData?.isCollege ?? false
      };
    }));

    // Process NCAA scores as standalone games when they don't match Odds API games
    const ncaaGamesProcessed = await Promise.all(ncaaScores.map(async (ns) => {
      const title = `${ns.homeTeam} vs ${ns.awayTeam}`;
      const existingGames = await storage.getGames();
      
      let dbGame = existingGames.find(g => 
        g.title === title && 
        Math.abs(g.startTime.getTime() - ns.startTime.getTime()) < 60000
      );
      
      if (!dbGame) {
        dbGame = await storage.createGame({
          title,
          teamA: ns.homeTeam,
          teamB: ns.awayTeam,
          league: ns.league,
          channel: "ESPN",
          startTime: ns.startTime,
          status: ns.status,
          relevance: 0,
          assignedTvCount: 0
        });
      } else if (dbGame.status !== ns.status) {
        await storage.updateGameStatus(dbGame.id, ns.status);
        dbGame.status = ns.status;
      }

      // Track NCAA enrichment
      ncaaGamesEnriched++;
      if (ns.status === "Live") gamesWithLiveScores++;

      return {
        ...dbGame,
        broadcastNetwork: "ESPN",
        homeScore: ns.homeScore,
        awayScore: ns.awayScore,
        scoreDiff: Math.abs(ns.homeScore - ns.awayScore),
        timeRemaining: ns.timeRemaining,
        period: ns.period,
        isOvertime: ns.isOvertime,
        isCollege: true
      };
    }));

    // Log enrichment summary
    console.log(`[Scores] Pro games enriched: ${proGamesEnriched}`);
    console.log(`[Scores] NCAA games enriched: ${ncaaGamesEnriched}`);
    console.log(`[Scores] Games with live scores: ${gamesWithLiveScores}`);

    // Combine all games - pro games first, then NCAA
    // Filter out games that are finished or too far in the past (>4 hours ago)
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const gamesToProcess = [...proGamesProcessed, ...ncaaGamesProcessed].filter(g => {
      // Keep live games
      if (g.status === "Live") return true;
      // Keep upcoming games
      if (g.status === "Upcoming") return true;
      // Filter out finished games that started more than 4 hours ago
      const gameStart = new Date(g.startTime);
      return gameStart >= fourHoursAgo;
    });

    const tvIdParam = req.query.tvId;
    const tvContext = tvIdParam ? await storage.getTv(Number(tvIdParam)) : null;

    const processedGames = gamesToProcess.map(g => {
      const gameForScoring = { 
        ...g, 
        assignedTvCount: stats[g.id] || 0 
      };

      // Get hotness with reasons
      const hotnessResult = computeBaseHotnessWithReasons(gameForScoring);
      const hotnessScore = hotnessResult.score;
      
      const relevanceResult = calculateRelevance(
        { ...gameForScoring, hotnessScore }, 
        prefs, 
        stats,
        tvContext ? { lastUpdated: tvContext.lastUpdated } : undefined
      );

      // Combine hotness reasons with preference-based reasons
      // Filter relevance reasons to only include preference-based ones
      const preferenceReasons = relevanceResult.reasons.filter(r => 
        r.includes("Preferred team") || 
        r.includes("Local interest") ||
        r.includes("league priority")
      );
      
      // Build whyThisGame from hotness + preference reasons (deduplicated)
      const whyThisGame = Array.from(new Set([...hotnessResult.reasons, ...preferenceReasons]));

      return {
        ...g,
        relevanceScore: relevanceResult.score,
        reasons: relevanceResult.reasons,
        whyThisGame,
        hotnessScore,
        assignedTvCount: stats[g.id] || 0
      };
    });

    const liveGames = processedGames
      .filter(g => g.status === 'Live')
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
      
    const otherGames = processedGames
      .filter(g => g.status !== 'Live')
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json([...liveGames, ...otherGames]);
  } catch (error) {
    console.error("Error fetching live games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
