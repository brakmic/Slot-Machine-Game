import { AggregateRoot } from '@nestjs/cqrs';
import { PlayerDepositedMoneyEvent, Player } from '@spin-win/domain';

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

  toPlayer(): Player {
    return new Player(this.id, this.name, this.balance);
  }
}
