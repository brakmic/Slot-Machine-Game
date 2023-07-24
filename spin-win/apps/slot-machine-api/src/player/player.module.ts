import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlayerController } from './player.controller';
import { CreatePlayerHandler, DepositMoneyHandler,
  GetAllPlayersHandler, GetPlayerByIdHandler,
  DeletePlayerHandler } from '@player/player.service';
import { DatabaseModule } from 'apps/slot-machine-api/src/common/persistence/database/database.module';
import { PlayerReadRepository, PlayerWriteRepository } from '@spin-win/infrastructure';
import { PlayerModel } from '@spin-win/db-models';
import { IPlayerRepository, PlayerDomainService } from '@spin-win/domain';


@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [PlayerController],
  providers: [
    GetAllPlayersHandler,
    GetPlayerByIdHandler,
    CreatePlayerHandler,
    DeletePlayerHandler,
    DepositMoneyHandler,
    {
      provide: 'PlayerWriteRepository',
      useFactory: (database) => new PlayerWriteRepository(database.getRepository(PlayerModel)),
      inject: ['Database'],
    },
    {
      provide: 'PlayerReadRepository',
      useFactory: (database) => new PlayerReadRepository(database.getRepository(PlayerModel)),
      inject: ['Database'],
    },
    {
      provide: 'PlayerDomainService',
      useFactory: (playerWriteRepository: IPlayerRepository) => new PlayerDomainService(playerWriteRepository),
      inject: ['PlayerWriteRepository'],
    },
  ],
})
export class PlayerModule {}
