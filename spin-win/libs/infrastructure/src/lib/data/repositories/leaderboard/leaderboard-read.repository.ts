import { Repository } from 'typeorm';
import { LeaderboardEntryModel } from '@db-models';
import { LeaderboardEntry, ILeaderboardRepository } from '@domain';

export class LeaderboardReadRepository implements ILeaderboardRepository {
  constructor(private repository: Repository<LeaderboardEntryModel>) {}

  async updatePlayerStats(playerId: number, playerName: string, spinResult: { winnings: number }): Promise<LeaderboardEntry> {
    throw new Error('Read repository cannot update entities');
  }

  async getTopByWinnings(limit: number): Promise<LeaderboardEntry[]> {
    const entries = await this.repository.find({
      order: {
        totalWinnings: 'DESC'
      },
      take: limit
    });
    
    return entries.map(LeaderboardEntryModel.toDomain);
  }

  async getByPlayerId(playerId: number): Promise<LeaderboardEntry | null> {
    const entry = await this.repository.findOne({ where: { playerId } });
    if (!entry) {
      return null;
    }
    return LeaderboardEntryModel.toDomain(entry);
  }

  async getAll(): Promise<LeaderboardEntry[]> {
    const entries = await this.repository.find({
      order: {
        rank: 'ASC'
      }
    });
    
    return entries.map(LeaderboardEntryModel.toDomain);
  }
}
