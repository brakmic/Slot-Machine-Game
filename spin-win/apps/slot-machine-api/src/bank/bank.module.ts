import { Module } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { BankController } from './bank.controller';
import {
  GetBankHandler,
  UpdateBankHandler,
  BalanceUpdatedHandler,
  CreateBankHandler,
  BankCreatedSuccessfullyHandler,
  BankCreationFailedHandler
} from '@bank/bank.service';
import { DatabaseModule } from 'apps/slot-machine-api/src/common/persistence/database/database.module';
import { BankReadRepository, BankWriteRepository } from '@spin-win/infrastructure';
import { BankModel } from '@spin-win/db-models';
import { IBankRepository, BankDomainService } from '@spin-win/domain';


@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [BankController],
  providers: [
    CreateBankHandler,
    GetBankHandler,
    UpdateBankHandler,
    BankCreatedSuccessfullyHandler,
    BankCreationFailedHandler,
    BalanceUpdatedHandler,
    EventPublisher,
    {
      provide: 'BankWriteRepository',
      useFactory: (database) => new BankWriteRepository(database.getRepository(BankModel)),
      inject: ['Database'],
    },
    {
      provide: 'BankReadRepository',
      useFactory: (database) => new BankReadRepository(database.getRepository(BankModel)),
      inject: ['Database'],
    },
    {
      provide: 'BankDomainService',
      useFactory: (bankWriteRepository: IBankRepository, eventPublisher: EventPublisher) => new BankDomainService(bankWriteRepository, eventPublisher),
      inject: ['BankWriteRepository', EventPublisher],
    },
  ],
})
export class BankModule {}
