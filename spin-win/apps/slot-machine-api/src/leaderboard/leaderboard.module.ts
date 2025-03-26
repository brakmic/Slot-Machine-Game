import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LeaderboardController } from './leaderboard.controller';
import {
  UpdateLeaderboardEntryHandler,
  GetTopPlayersHandler,
  GetPlayerStatsHandler,
  GetAllLeaderboardEntriesHandler
} from './leaderboard.service';
import { DatabaseModule } from 'apps/slot-machine-api/src/common/persistence/database/database.module';
import { LeaderboardEntryModel } from '@db-models';
import { LeaderboardDomainService, ILeaderboardRepository } from '@domain';
import { LeaderboardReadRepository, LeaderboardWriteRepository } from '@infrastructure';

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [LeaderboardController],
  providers: [
    UpdateLeaderboardEntryHandler,
    GetTopPlayersHandler,
    GetPlayerStatsHandler,
    GetAllLeaderboardEntriesHandler,
    {
      provide: 'LeaderboardWriteRepository',
      useFactory: (database) => new LeaderboardWriteRepository(database.getRepository(LeaderboardEntryModel)),
      inject: ['Database'],
    },
    {
      provide: 'LeaderboardReadRepository',
      useFactory: (database) => new LeaderboardReadRepository(database.getRepository(LeaderboardEntryModel)),
      inject: ['Database'],
    },
    {
      provide: 'LeaderboardDomainService',
      useFactory: (leaderboardWriteRepository: ILeaderboardRepository) => 
        new LeaderboardDomainService(leaderboardWriteRepository),
      inject: ['LeaderboardWriteRepository'],
    },
  ],
  exports: ['LeaderboardDomainService'],
})
export class LeaderboardModule {}
