import { Injectable, Inject } from '@nestjs/common';
import { ICommandHandler, EventPublisher, CommandHandler,
  QueryHandler, EventsHandler, IEventHandler, IQueryHandler } from '@nestjs/cqrs';
import { PlayerAggregate, PlayerDepositedMoneyEvent, PlayerDomainService, SpinExecutedEvent, SpinOutcomeGeneratedEvent } from '@domain';
import { IRepository } from '@infrastructure';
import { ReadPlayerDto } from '@player/dto/read-player.dto';
import { GetAllPlayersQuery, GetPlayerByIdQuery } from '@player/queries/player.queries';
import { CreatePlayerCommand, DepositMoneyCommand, DeletePlayerCommand } from '@player/commands/player.commands';

// Commands
@Injectable()
@CommandHandler(CreatePlayerCommand)
export class CreatePlayerHandler implements ICommandHandler<CreatePlayerCommand> {
  constructor(
    @Inject('PlayerWriteRepository')
    private readonly playerRepository: IRepository<PlayerAggregate>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreatePlayerCommand) {
    const { name, balance } = command;
    const playerModel = await this.playerRepository.create({ name, balance });
    const playerAggregate = this.publisher.mergeObjectContext(
      new PlayerAggregate().init(playerModel)
    );
    
    playerAggregate.commit();
  }
  
}

@Injectable()
@CommandHandler(DeletePlayerCommand)
export class DeletePlayerHandler implements ICommandHandler<DeletePlayerCommand> {
  constructor(
    @Inject('PlayerWriteRepository')
    private readonly playerWriteRepository: IRepository<PlayerAggregate>,
  ) {}

  async execute(command: DeletePlayerCommand) {
    const { playerId } = command;
    await this.playerWriteRepository.delete(playerId);
  }
}

@Injectable()
@CommandHandler(DepositMoneyCommand)
export class DepositMoneyHandler implements ICommandHandler<DepositMoneyCommand> {
  constructor(
    @Inject('PlayerDomainService')
    private readonly playerDomainService: PlayerDomainService,
  ) {}

  async execute(command: DepositMoneyCommand) {
    const updatedPlayer = await this.playerDomainService.depositMoney(command.playerId, command.amount);
    return updatedPlayer;
  }
}


// Event
@Injectable()
@EventsHandler(PlayerDepositedMoneyEvent)
export class MoneyDepositedHandler implements IEventHandler<PlayerDepositedMoneyEvent> {
  constructor(
    @Inject('PlayerReadRepository')
    private readonly playerRepository: IRepository<ReadPlayerDto>,
  ) {}

  async handle(event: PlayerDepositedMoneyEvent) {
    const playerDto = await this.playerRepository.getById(event.playerId);
    const updatedPlayerDto = new ReadPlayerDto(playerDto.id, playerDto.name, playerDto.balance + event.amount);
    await this.playerRepository.update(updatedPlayerDto);
  }
}

@Injectable()
@EventsHandler(SpinExecutedEvent)
export class SpinExecutedHandler implements IEventHandler<SpinExecutedEvent> {
  constructor(
    @Inject('PlayerReadRepository')
    private readonly playerRepository: IRepository<ReadPlayerDto>,
  ) {}

  async handle(event: SpinExecutedEvent) {
    // Retrieve the player by ID
    const playerDto = await this.playerRepository.getById(event.playerId);
    
    // Deduct the bet amount from the player's balance
    const updatedPlayerDto = new ReadPlayerDto(playerDto.id, playerDto.name, playerDto.balance - event.betAmount);

    // Update the player record
    await this.playerRepository.update(updatedPlayerDto);
  }
}

@Injectable()
@EventsHandler(SpinOutcomeGeneratedEvent)
export class SpinOutcomeGeneratedHandler implements IEventHandler<SpinOutcomeGeneratedEvent> {
  constructor(
    @Inject('PlayerReadRepository')
    private readonly playerRepository: IRepository<ReadPlayerDto>,
  ) {}

  async handle(event: SpinOutcomeGeneratedEvent) {
    // Retrieve the player by ID
    const playerDto = await this.playerRepository.getById(event.playerId);
    
    // Calculate the new balance based on the winnings
    const updatedPlayerDto = new ReadPlayerDto(playerDto.id, playerDto.name, playerDto.balance + event.winnings);

    // Update the player record
    await this.playerRepository.update(updatedPlayerDto);
  }
}

// Queries
@Injectable()
@QueryHandler(GetAllPlayersQuery)
export class GetAllPlayersHandler implements IQueryHandler<GetAllPlayersQuery> {
  constructor(
    @Inject('PlayerReadRepository')
    private readonly playerRepository: IRepository<ReadPlayerDto>,
  ) {}

  async execute(query: GetAllPlayersQuery): Promise<ReadPlayerDto[]> {
    return this.playerRepository.getAll();
  }
}

@Injectable()
@QueryHandler(GetPlayerByIdQuery)
export class GetPlayerByIdHandler implements IQueryHandler<GetPlayerByIdQuery> {
  constructor(
    @Inject('PlayerReadRepository')
    private readonly playerRepository: IRepository<ReadPlayerDto>,
  ) {}

  async execute(query: GetPlayerByIdQuery): Promise<ReadPlayerDto> {
    return this.playerRepository.getById(query.id);
  }
}

