import { Module } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SpinController } from './spin.controller';
import {
  ExecuteSpinHandler,
  GetSpinByIdHandler,
  GetSpinsByPlayerHandler,
  SpinExecutedHandler,
  SpinOutcomeGeneratedHandler
} from './spin.service';
import { DatabaseModule } from 'apps/slot-machine-api/src/common/persistence/database/database.module';
import { SpinReadRepository, SpinWriteRepository } from '@infrastructure';
import { SpinModel } from '@db-models';
import { ISpinRepository, SpinDomainService } from '@domain';
import { PlayerModule } from '../player/player.module';
import { BankModule } from '../bank/bank.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [CqrsModule, DatabaseModule, PlayerModule, BankModule, LeaderboardModule],
  controllers: [SpinController],
  providers: [
    ExecuteSpinHandler,
    GetSpinByIdHandler,
    GetSpinsByPlayerHandler,
    SpinExecutedHandler,
    SpinOutcomeGeneratedHandler,
    EventPublisher,
    {
      provide: 'SpinWriteRepository',
      useFactory: (database) => new SpinWriteRepository(database.getRepository(SpinModel)),
      inject: ['Database'],
    },
    {
      provide: 'SpinReadRepository',
      useFactory: (database) => new SpinReadRepository(database.getRepository(SpinModel)),
      inject: ['Database'],
    },
    {
      provide: 'SpinDomainService',
      useFactory: (spinWriteRepository: ISpinRepository, eventPublisher: EventPublisher) => 
        new SpinDomainService(spinWriteRepository, eventPublisher),
      inject: ['SpinWriteRepository', EventPublisher],
    },
  ],
  exports: ['SpinDomainService'],
})
export class SpinModule {}
