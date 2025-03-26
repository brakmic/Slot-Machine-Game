import { AggregateRoot } from '@nestjs/cqrs';
import { SpinOutcome } from '../types/spin-outcome.enum';
import { SpinExecutedEvent, SpinOutcomeGeneratedEvent } from '../events/spin.events';

// Spin Aggregate
export class SpinAggregate extends AggregateRoot {
  id: number;
  playerId: number;
  symbols: string[];
  outcome: SpinOutcome;
  winnings: number;
  timestamp: Date;

  constructor(id: number, playerId: number) {
    super();
    this.id = id;
    this.playerId = playerId;
  }

  executeSpin(betAmount: number) {
    // Generate symbols and determine the outcome
    this.symbols = this.randomizeSymbols();
    this.outcome = this.determineOutcome();
    this.winnings = this.calculateWinnings(betAmount);
    this.timestamp = new Date();

    // Fire domain event to handle player debit and bank credit
    this.apply(new SpinExecutedEvent(this.playerId, betAmount));

    // Fire domain event to handle win/loss outcome
    this.apply(new SpinOutcomeGeneratedEvent(this.playerId, this.outcome, this.winnings));
  }

  private randomizeSymbols(): string[] {
    const symbols = ['🍒', '🍊', '🍋', '🍇', '🔔', '💰', '7️⃣'];
    // Generate 3 random symbols
    return Array.from({ length: 3 }, () => {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      return symbols[randomIndex];
    });
  }

  private determineOutcome(): SpinOutcome {
    // Check if all symbols are the same
    const allSame = this.symbols.every(symbol => symbol === this.symbols[0]);
    
    // Special case for triple sevens
    const allSevens = this.symbols.every(symbol => symbol === '7️⃣');
    
    // Special case for triple money bags
    const allMoneyBags = this.symbols.every(symbol => symbol === '💰');
    
    if (allSevens) {
      return SpinOutcome.JACKPOT;
    } else if (allMoneyBags) {
      return SpinOutcome.BIG_WIN;
    } else if (allSame) {
      return SpinOutcome.WIN;
    } else {
      // Check for two matching symbols
      const uniqueSymbols = new Set(this.symbols);
      if (uniqueSymbols.size === 2) {
        return SpinOutcome.SMALL_WIN;
      }
      return SpinOutcome.LOSS;
    }
  }

  private calculateWinnings(betAmount: number): number {
    switch (this.outcome) {
      case SpinOutcome.JACKPOT:
        return betAmount * 10; // 10x for jackpot
      case SpinOutcome.BIG_WIN:
        return betAmount * 5;  // 5x for big win
      case SpinOutcome.WIN:
        return betAmount * 3;  // 3x for regular win
      case SpinOutcome.SMALL_WIN:
        return betAmount * 1.5; // 1.5x for small win
      default:
        return 0; // No winnings for loss
    }
  }
}
