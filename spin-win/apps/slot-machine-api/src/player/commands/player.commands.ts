export class CreatePlayerCommand {
  constructor(public readonly name: string, public readonly balance: number) {}
}

export class DepositMoneyCommand {
  constructor(public readonly playerId: number, public readonly amount: number) {}
}

export class DeletePlayerCommand {
  constructor(public readonly playerId: number) {}
}
