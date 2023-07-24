export class PlayerDepositedMoneyEvent {
  constructor(public readonly playerId: number, public readonly amount: number) {}
}
