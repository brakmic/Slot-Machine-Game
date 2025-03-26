import { Entity, Column, PrimaryColumn } from 'typeorm';
import { LeaderboardEntry } from '@domain';

@Entity('leaderboard_entries')
export class LeaderboardEntryModel {
  @PrimaryColumn()
  playerId: number;

  @Column()
  playerName: string;

  @Column()
  totalSpins: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalWinnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  biggestWin: number;

  @Column()
  rank: number;

  static toDomain(model: LeaderboardEntryModel): LeaderboardEntry {
    return new LeaderboardEntry(
      model.playerId,
      model.playerName,
      model.totalSpins,
      model.totalWinnings,
      model.biggestWin,
      model.rank
    );
  }

  static fromDomain(entry: LeaderboardEntry): LeaderboardEntryModel {
    const model = new LeaderboardEntryModel();
    model.playerId = entry.playerId;
    model.playerName = entry.playerName;
    model.totalSpins = entry.totalSpins;
    model.totalWinnings = entry.totalWinnings;
    model.biggestWin = entry.biggestWin;
    model.rank = entry.rank;
    return model;
  }
}
