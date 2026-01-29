import { Request, Response } from "express";
import { storage } from "../storage";
import { calculateRelevance } from "../engine/relevance";
import { computeBaseHotness, computeFinalHotness } from "../engine/hotness";
import { fetchLiveGames } from "../integrations/oddsApi";
import { fetchProScores } from "../services/proScoresApi";
import { fetchNcaaScores } from "../services/ncaaScoresApi";

/**
 * Match a score from external services to a base game from Odds API
 */
function findMatchingScore(game: any, scores: any[]) {
  const startTime = new Date(game.startTime).getTime();
  const thirtyMinutes = 30 * 60 * 1000;

  return scores.find(s => {
    const sTime = new Date(s.startTime).getTime();
    const timeMatch = Math.abs(startTime - sTime) <= thirtyMinutes;
    const leagueMatch = s.league.toUpperCase() === game.league.toUpperCase();
    
    const teamAMatch = 
      s.homeTeam.toLowerCase().includes(game.teamA.toLowerCase()) || 
      game.teamA.toLowerCase().includes(s.homeTeam.toLowerCase()) ||
      s.awayTeam.toLowerCase().includes(game.teamA.toLowerCase()) ||
      game.teamA.toLowerCase().includes(s.awayTeam.toLowerCase());

    const teamBMatch = 
      s.homeTeam.toLowerCase().includes(game.teamB.toLowerCase()) || 
      game.teamB.toLowerCase().includes(s.homeTeam.toLowerCase()) ||
      s.awayTeam.toLowerCase().includes(game.teamB.toLowerCase()) ||
      game.teamB.toLowerCase().includes(s.awayTeam.toLowerCase());

    return timeMatch && leagueMatch && teamAMatch && teamBMatch;
  });
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
    let dataSourceName = externalGames.length > 0 ? "Odds API" : "Mock Fallback";

    // Process Pro Games
    const now = new Date();
    const gamesToProcess = await Promise.all(sourceData.map(async (eg) => {
      const startTime = new Date(eg.startTime);
      const hasStarted = startTime <= now;
      
      const title = `${eg.homeTeam} vs ${eg.awayTeam}`;
      const existingGames = await storage.getGames();
      
      let dbGame = existingGames.find(g => 
        g.title === title && 
        Math.abs(g.startTime.getTime() - startTime.getTime()) < 60000
      );
      
      // Match with real-time scores
      const scoreData = findMatchingScore(eg, allScores);
      const status = scoreData ? scoreData.status : (hasStarted && eg.isLive ? "Live" : "Upcoming");

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

    const tvIdParam = req.query.tvId;
    const tvContext = tvIdParam ? await storage.getTv(Number(tvIdParam)) : null;

    const processedGames = gamesToProcess.map(g => {
      const gameForScoring = { 
        ...g, 
        assignedTvCount: stats[g.id] || 0 
      };

      const hotnessScore = computeFinalHotness(gameForScoring, prefs);
      const relevanceResult = calculateRelevance(
        { ...gameForScoring, hotnessScore }, 
        prefs, 
        stats,
        tvContext ? { lastUpdated: tvContext.lastUpdated } : undefined
      );

      return {
        ...g,
        relevanceScore: relevanceResult.score,
        reasons: relevanceResult.reasons,
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
