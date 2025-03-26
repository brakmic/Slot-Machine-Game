import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LeaderboardDomainService } from '@domain';
import { LeaderboardEntryDto } from './dto/leaderboard-entry.dto';
import { UpdateLeaderboardEntryCommand } from './commands/leaderboard.commands';
import { GetTopPlayersQuery, GetPlayerStatsQuery, GetAllLeaderboardEntriesQuery } from './queries/leaderboard.queries';

@CommandHandler(UpdateLeaderboardEntryCommand)
export class UpdateLeaderboardEntryHandler implements ICommandHandler<UpdateLeaderboardEntryCommand, LeaderboardEntryDto> {
  constructor(
    @Inject('LeaderboardDomainService')
    private readonly leaderboardDomainService: LeaderboardDomainService
  ) {}

  async execute(command: UpdateLeaderboardEntryCommand): Promise<LeaderboardEntryDto> {
    const { playerId, playerName, spinResult } = command;
    
    const updatedEntry = await this.leaderboardDomainService.updatePlayerStats(
      playerId,
      playerName,
      spinResult
    );
    
    return {
      playerId: updatedEntry.playerId,
      playerName: updatedEntry.playerName,
      totalSpins: updatedEntry.totalSpins,
      totalWinnings: updatedEntry.totalWinnings,
      biggestWin: updatedEntry.biggestWin,
      rank: updatedEntry.rank
    };
  }
}

@QueryHandler(GetTopPlayersQuery)
export class GetTopPlayersHandler implements IQueryHandler<GetTopPlayersQuery, LeaderboardEntryDto[]> {
  constructor(
    @Inject('LeaderboardDomainService')
    private readonly leaderboardDomainService: LeaderboardDomainService
  ) {}

  async execute(query: GetTopPlayersQuery): Promise<LeaderboardEntryDto[]> {
    const entries = await this.leaderboardDomainService.getTopPlayers(query.limit);
    
    return entries.map(entry => ({
      playerId: entry.playerId,
      playerName: entry.playerName,
      totalSpins: entry.totalSpins,
      totalWinnings: entry.totalWinnings,
      biggestWin: entry.biggestWin,
      rank: entry.rank
    }));
  }
}

@QueryHandler(GetPlayerStatsQuery)
export class GetPlayerStatsHandler implements IQueryHandler<GetPlayerStatsQuery, LeaderboardEntryDto | null> {
  constructor(
    @Inject('LeaderboardDomainService')
    private readonly leaderboardDomainService: LeaderboardDomainService
  ) {}

  async execute(query: GetPlayerStatsQuery): Promise<LeaderboardEntryDto | null> {
    const entry = await this.leaderboardDomainService.getPlayerStats(query.playerId);
    
    if (!entry) {
      return null;
    }
    
    return {
      playerId: entry.playerId,
      playerName: entry.playerName,
      totalSpins: entry.totalSpins,
      totalWinnings: entry.totalWinnings,
      biggestWin: entry.biggestWin,
      rank: entry.rank
    };
  }
}

@QueryHandler(GetAllLeaderboardEntriesQuery)
export class GetAllLeaderboardEntriesHandler implements IQueryHandler<GetAllLeaderboardEntriesQuery, LeaderboardEntryDto[]> {
  constructor(
    @Inject('LeaderboardDomainService')
    private readonly leaderboardDomainService: LeaderboardDomainService
  ) {}

  async execute(_: GetAllLeaderboardEntriesQuery): Promise<LeaderboardEntryDto[]> {
    const entries = await this.leaderboardDomainService.getAllLeaderboardEntries();
    
    return entries.map(entry => ({
      playerId: entry.playerId,
      playerName: entry.playerName,
      totalSpins: entry.totalSpins,
      totalWinnings: entry.totalWinnings,
      biggestWin: entry.biggestWin,
      rank: entry.rank
    }));
  }
}
