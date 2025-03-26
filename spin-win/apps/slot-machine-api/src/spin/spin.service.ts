import { CommandHandler, EventsHandler, ICommandHandler, IEventHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ISpinRepository, SpinDomainService, SpinOutcomeGeneratedEvent, SpinExecutedEvent } from '@domain';
import { ExecuteSpinCommand } from './commands/spin.commands';
import { GetSpinByIdQuery, GetSpinsByPlayerQuery } from './queries/spin.queries';
import { SpinResultDto } from './dto/spin-result.dto';
import { UpdateLeaderboardEntryCommand } from '@leaderboard/commands/leaderboard.commands';

@CommandHandler(ExecuteSpinCommand)
export class ExecuteSpinHandler implements ICommandHandler<ExecuteSpinCommand> {
  constructor(
    @Inject('SpinDomainService')
    private readonly spinDomainService: SpinDomainService
  ) {}

  async execute(command: ExecuteSpinCommand): Promise<void> {
    const { playerId, betAmount } = command;
    // Generate a new ID - in a real app, this might be handled differently
    const spinId = Math.floor(Math.random() * 1000000);
    await this.spinDomainService.executeSpin(spinId, playerId, betAmount);
  }
}

@QueryHandler(GetSpinByIdQuery)
export class GetSpinByIdHandler implements IQueryHandler<GetSpinByIdQuery, SpinResultDto> {
  constructor(
    @Inject('SpinReadRepository')
    private readonly spinReadRepository: ISpinRepository
  ) {}

  async execute(query: GetSpinByIdQuery): Promise<SpinResultDto | null> {
    const spin = await this.spinReadRepository.findById(query.id);
    if (!spin) {
      return null;
    }

    return {
      id: spin.id,
      playerId: spin.playerId,
      symbols: spin.symbols,
      outcome: spin.outcome,
      winnings: spin.winnings,
      timestamp: spin.timestamp
    };
  }
}

@QueryHandler(GetSpinsByPlayerQuery)
export class GetSpinsByPlayerHandler implements IQueryHandler<GetSpinsByPlayerQuery, SpinResultDto[]> {
  constructor(
    @Inject('SpinReadRepository')
    private readonly spinReadRepository: ISpinRepository
  ) {}

  async execute(query: GetSpinsByPlayerQuery): Promise<SpinResultDto[]> {
    const spins = await this.spinReadRepository.findByPlayerId(query.playerId);
    
    return spins.map(spin => ({
      id: spin.id,
      playerId: spin.playerId,
      symbols: spin.symbols,
      outcome: spin.outcome,
      winnings: spin.winnings,
      timestamp: spin.timestamp
    }));
  }
}

@EventsHandler(SpinExecutedEvent)
export class SpinExecutedHandler implements IEventHandler<SpinExecutedEvent> {
  constructor(
    @Inject('PlayerDomainService')
    private readonly playerDomainService: any
  ) {}

  async handle(event: SpinExecutedEvent) {
    const { playerId, betAmount } = event;
    // Update player's balance by deducting the bet amount
    // Ideally this should use the player's handleSpinExecution method
    await this.playerDomainService.updateBalance(playerId, -betAmount);
  }
}

@EventsHandler(SpinOutcomeGeneratedEvent)
export class SpinOutcomeGeneratedHandler implements IEventHandler<SpinOutcomeGeneratedEvent> {
  constructor(
    @Inject('PlayerDomainService')
    private readonly playerDomainService: any,
    @Inject('BankDomainService')
    private readonly bankDomainService: any,
    private readonly commandBus: CommandBus
  ) {}

  async handle(event: SpinOutcomeGeneratedEvent) {
    const { playerId, winnings } = event;
    
    // Handle winnings (credit player, debit bank)
    if (winnings > 0) {
      // Credit the player's balance with winnings
      await this.playerDomainService.updateBalance(playerId, winnings);
      
      // Deduct from the bank's balance
      const bankId = 1; // Assuming a single bank with ID 1
      await this.bankDomainService.updateBalance(bankId, -winnings);
    }
    
    // Get player name to update leaderboard
    const player = await this.playerDomainService.getPlayer(playerId);
    
    // Update leaderboard with spin result
    await this.commandBus.execute(
      new UpdateLeaderboardEntryCommand(
        playerId,
        player.name,
        { winnings }
      )
    );
  }
}
