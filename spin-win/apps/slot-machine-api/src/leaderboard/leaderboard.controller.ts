import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LeaderboardEntryDto } from './dto/leaderboard-entry.dto';
import { UpdateLeaderboardEntryCommand } from './commands/leaderboard.commands';
import { GetTopPlayersQuery, GetPlayerStatsQuery, GetAllLeaderboardEntriesQuery } from './queries/leaderboard.queries';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('update')
  @ApiOperation({ summary: 'Update leaderboard entry for a player after a spin' })
  @ApiResponse({ status: 200, description: 'Leaderboard entry updated successfully', type: LeaderboardEntryDto })
  async updateLeaderboardEntry(
    @Body() updateData: { playerId: number, playerName: string, spinResult: { winnings: number } }
  ): Promise<LeaderboardEntryDto> {
    return this.commandBus.execute(
      new UpdateLeaderboardEntryCommand(
        updateData.playerId,
        updateData.playerName,
        updateData.spinResult
      )
    );
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top players by winnings' })
  @ApiResponse({ status: 200, description: 'Returns top players', type: [LeaderboardEntryDto] })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of top players to return' })
  async getTopPlayers(@Query('limit') limit = 10): Promise<LeaderboardEntryDto[]> {
    return this.queryBus.execute(new GetTopPlayersQuery(limit));
  }

  @Get('player/:id')
  @ApiOperation({ summary: 'Get stats for a specific player' })
  @ApiResponse({ status: 200, description: 'Returns player stats', type: LeaderboardEntryDto })
  @ApiParam({ name: 'id', description: 'Player ID' })
  async getPlayerStats(@Param('id') playerId: number): Promise<LeaderboardEntryDto | null> {
    return this.queryBus.execute(new GetPlayerStatsQuery(playerId));
  }

  @Get()
  @ApiOperation({ summary: 'Get all leaderboard entries' })
  @ApiResponse({ status: 200, description: 'Returns all leaderboard entries', type: [LeaderboardEntryDto] })
  async getAllEntries(): Promise<LeaderboardEntryDto[]> {
    return this.queryBus.execute(new GetAllLeaderboardEntriesQuery());
  }
}
