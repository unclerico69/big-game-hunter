export function computeHotness(game: any): number {
  let score = 0;

  // Game must be live to be hot
  if (game.status !== "Live") return 0;

  // Close game late
  if (typeof game.scoreDiff === "number" && game.scoreDiff <= 7) {
    score += 30;
  }

  if (typeof game.timeRemaining === "number" && game.timeRemaining <= 300) {
    score += 30;
  }

  // Overtime / extra time
  if (game.isOvertime === true) {
    score += 40;
  }

  return Math.min(score, 100);
}
