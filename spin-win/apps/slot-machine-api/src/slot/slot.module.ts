import { Module } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SlotController } from './slot.controller';
import {
  CreateSlotHandler,
  GetSlotByIdHandler,
  GetAllSlotsHandler,
  GetRandomSymbolsHandler
} from './slot.service';
import { DatabaseModule } from 'apps/slot-machine-api/src/common/persistence/database/database.module';
import { SlotModel } from '@db-models';
import { ISlotRepository, SlotDomainService } from '@domain';
import { SlotReadRepository, SlotWriteRepository } from '@infrastructure';

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [SlotController],
  providers: [
    CreateSlotHandler,
    GetSlotByIdHandler,
    GetAllSlotsHandler,
    GetRandomSymbolsHandler,
    EventPublisher,
    {
      provide: 'SlotWriteRepository',
      useFactory: (database) => new SlotWriteRepository(database.getRepository(SlotModel)),
      inject: ['Database'],
    },
    {
      provide: 'SlotReadRepository',
      useFactory: (database) => new SlotReadRepository(database.getRepository(SlotModel)),
      inject: ['Database'],
    },
    {
      provide: 'SlotDomainService',
      useFactory: (slotWriteRepository: ISlotRepository, eventPublisher: EventPublisher) => 
        new SlotDomainService(slotWriteRepository, eventPublisher),
      inject: ['SlotWriteRepository', EventPublisher],
    },
  ],
  exports: ['SlotDomainService'],
})
export class SlotModule {}
