import { AggregateRoot } from '@nestjs/cqrs';
import { Bank, BankReceivedDepositEvent, BankMadeWithdrawalEvent } from '@domain';

export class BankAggregate extends AggregateRoot {
  id: number;
  balance: number;

  init(bank: Bank) {
    this.id = bank.id;
    this.balance = bank.balance;
    return this;
  }

  depositMoney(amount: number) {
    this.balance += amount;
    this.apply(new BankReceivedDepositEvent(this.id, amount));
  }

  withdrawMoney(amount: number) {
    this.balance -= amount;
    this.apply(new BankMadeWithdrawalEvent(this.id, amount));
  }

  handleSpinExecution(betAmount: number) {
    this.balance += betAmount;
    this.apply(new BankReceivedDepositEvent(this.id, betAmount));
  }

  handleSpinOutcome(winnings: number) {
    this.balance -= winnings;
    this.apply(new BankMadeWithdrawalEvent(this.id, winnings));
  }

  toBank(): Bank {
    return new Bank(this.id, this.balance);
  }
}
