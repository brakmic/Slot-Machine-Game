import { ILeaderboardRepository } from '../repositories/leaderboard.repository';
import { LeaderboardEntry } from '../entities/leaderboard/leaderboard-entry.entity';

export class LeaderboardDomainService {
  constructor(
    private readonly leaderboardRepository: ILeaderboardRepository
  ) {}

  async updatePlayerStats(
    playerId: number,
    playerName: string,
    spinResult: { winnings: number }
  ): Promise<LeaderboardEntry> {
    return this.leaderboardRepository.updatePlayerStats(playerId, playerName, spinResult);
  }

  async getTopPlayers(limit: number): Promise<LeaderboardEntry[]> {
    return this.leaderboardRepository.getTopByWinnings(limit);
  }

  async getPlayerStats(playerId: number): Promise<LeaderboardEntry | null> {
    return this.leaderboardRepository.getByPlayerId(playerId);
  }

  async getAllLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    return this.leaderboardRepository.getAll();
  }
}
