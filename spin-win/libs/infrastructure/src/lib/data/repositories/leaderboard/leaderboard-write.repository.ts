import { Repository } from 'typeorm';
import { LeaderboardEntryModel } from '@db-models';
import { LeaderboardEntry, ILeaderboardRepository } from '@domain';

export class LeaderboardWriteRepository implements ILeaderboardRepository {
  constructor(private repository: Repository<LeaderboardEntryModel>) {}

  async updatePlayerStats(playerId: number, playerName: string, spinResult: { winnings: number }): Promise<LeaderboardEntry> {
    // Find existing entry or create a new one
    let entry = await this.repository.findOne({ where: { playerId } });
    
    if (!entry) {
      entry = new LeaderboardEntryModel();
      entry.playerId = playerId;
      entry.playerName = playerName;
      entry.totalSpins = 0;
      entry.totalWinnings = 0;
      entry.biggestWin = 0;
      entry.rank = 0; // Will be updated later
    }
    
    // Update stats
    entry.playerName = playerName; // Update name in case it changed
    entry.totalSpins += 1;
    entry.totalWinnings += spinResult.winnings;
    
    if (spinResult.winnings > entry.biggestWin) {
      entry.biggestWin = spinResult.winnings;
    }
    
    const savedEntry = await this.repository.save(entry);
    
    // Update ranks for all entries
    await this.updateRanks();
    
    // Get the updated entry with the correct rank
    const refreshedEntry = await this.repository.findOne({ where: { playerId } });
    return LeaderboardEntryModel.toDomain(refreshedEntry);
  }

  private async updateRanks(): Promise<void> {
    // Get all entries ordered by total winnings
    const entries = await this.repository.find({
      order: {
        totalWinnings: 'DESC'
      }
    });
    
    // Update ranks
    for (let i = 0; i < entries.length; i++) {
      entries[i].rank = i + 1;
    }
    
    // Save all entries with updated ranks
    await this.repository.save(entries);
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
