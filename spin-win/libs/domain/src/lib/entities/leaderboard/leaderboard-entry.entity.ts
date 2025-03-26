/**
 * Represents a leaderboard entry for a player
 */
export class LeaderboardEntry {
  /**
   * Creates a new LeaderboardEntry instance
   * @param playerId Unique identifier of the player
   * @param playerName Name of the player
   * @param totalSpins Total number of spins the player has made
   * @param totalWinnings Total amount of winnings the player has earned
   * @param biggestWin Largest single win the player has achieved
   * @param rank Current rank of the player on the leaderboard
   */
  constructor(
    public readonly playerId: number,
    public readonly playerName: string,
    public readonly totalSpins: number,
    public readonly totalWinnings: number,
    public readonly biggestWin: number,
    public readonly rank: number
  ) {}
}
