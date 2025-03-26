import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ISlotRepository, SlotDomainService } from '@domain';
import { CreateSlotCommand } from './commands/slot.commands';
import { SlotResultDto } from './dto/slot-result.dto';
import { GetSlotByIdQuery, GetAllSlotsQuery, GetRandomSymbolsQuery } from './queries/slot.queries';

@CommandHandler(CreateSlotCommand)
export class CreateSlotHandler implements ICommandHandler<CreateSlotCommand> {
  constructor(
    @Inject('SlotDomainService')
    private readonly slotDomainService: SlotDomainService
  ) {}

  async execute(command: CreateSlotCommand): Promise<void> {
    // Generate a new ID - in a real app, this might be handled differently
    const slotId = Math.floor(Math.random() * 1000000);
    await this.slotDomainService.createSlot(slotId, command.symbol);
  }
}

@QueryHandler(GetSlotByIdQuery)
export class GetSlotByIdHandler implements IQueryHandler<GetSlotByIdQuery, SlotResultDto> {
  constructor(
    @Inject('SlotReadRepository')
    private readonly slotReadRepository: ISlotRepository
  ) {}

  async execute(query: GetSlotByIdQuery): Promise<SlotResultDto | null> {
    const slot = await this.slotReadRepository.findById(query.id);
    if (!slot) {
      return null;
    }

    return {
      id: slot.id,
      symbol: slot.symbol
    };
  }
}

@QueryHandler(GetAllSlotsQuery)
export class GetAllSlotsHandler implements IQueryHandler<GetAllSlotsQuery, SlotResultDto[]> {
  constructor(
    @Inject('SlotReadRepository')
    private readonly slotReadRepository: ISlotRepository
  ) {}

  async execute(_: GetAllSlotsQuery): Promise<SlotResultDto[]> {
    const slots = await this.slotReadRepository.findAll();
    
    return slots.map(slot => ({
      id: slot.id,
      symbol: slot.symbol
    }));
  }
}

@QueryHandler(GetRandomSymbolsQuery)
export class GetRandomSymbolsHandler implements IQueryHandler<GetRandomSymbolsQuery, string[]> {
  constructor(
    @Inject('SlotDomainService')
    private readonly slotDomainService: SlotDomainService
  ) {}

  async execute(query: GetRandomSymbolsQuery): Promise<string[]> {
    return this.slotDomainService.generateRandomSymbols(query.count);
  }
}
