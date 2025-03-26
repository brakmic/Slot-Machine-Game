import { LeaderboardEntry } from '../entities/leaderboard/leaderboard-entry.entity';

/**
 * Interface for Leaderboard repositories
 */
export interface ILeaderboardRepository {
  /**
   * Update a leaderboard entry for a player
   * @param playerId ID of the player
   * @param playerName Name of the player
   * @param spinResult Spin result data to update stats
   * @returns The updated leaderboard entry
   */
  updatePlayerStats(playerId: number, playerName: string, spinResult: {
    winnings: number,
  }): Promise<LeaderboardEntry>;

  /**
   * Get top players by total winnings
   * @param limit Maximum number of entries to return
   * @returns Array of leaderboard entries
   */
  getTopByWinnings(limit: number): Promise<LeaderboardEntry[]>;

  /**
   * Get a player's leaderboard entry
   * @param playerId ID of the player
   * @returns The leaderboard entry or null if not found
   */
  getByPlayerId(playerId: number): Promise<LeaderboardEntry | null>;
  
  /**
   * Get all leaderboard entries
   * @returns Array of all leaderboard entries
   */
  getAll(): Promise<LeaderboardEntry[]>;
}
