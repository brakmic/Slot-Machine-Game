import { AggregateRoot } from '@nestjs/cqrs';
import { PlayerDepositedMoneyEvent, Player } from '@domain';

export class PlayerAggregate extends AggregateRoot {
  id: number;
  name: string;
  balance: number;

  init(player: Player) {
    this.id = player.id;
    this.name = player.name;
    this.balance = player.balance;
    return this;
  }

  depositMoney(amount: number) {
    this.balance += amount;
    this.apply(new PlayerDepositedMoneyEvent(this.id, amount));
  }

  // This method can be used to handle spin execution, reducing the player's balance
  handleSpinExecution(betAmount: number) {
    this.balance -= betAmount;
    // Recommended domain event to record the spin execution
    // this.apply(new PlayerSpinExecutedEvent(this.id, betAmount));
  }

  // This method can be used to handle the outcome of a spin, increasing the player's balance if winnings are awarded
  handleSpinOutcome(winnings: number) {
    this.balance += winnings;
    // Recommended domain event to record the outcome of the spin
    // this.apply(new PlayerSpinOutcomeReceivedEvent(this.id, winnings));
  }

  toPlayer(): Player {
    return new Player(this.id, this.name, this.balance);
  }
}
