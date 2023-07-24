export class CreateBankCommand {
  constructor(public readonly balance: number) {}
}

export class UpdateBankCommand {
  constructor(public readonly bankId: number, public readonly amount: number) {}
}
