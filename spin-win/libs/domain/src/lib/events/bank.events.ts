export class BankReceivedDepositEvent {
  constructor(public readonly bankId: number, public readonly amount: number) {}
}

export class BankMadeWithdrawalEvent {
  constructor(public readonly bankId: number, public readonly amount: number) {}
}

export class BankCreatedSuccessfullyEvent {
  constructor(public readonly bankId: number) {}
}

export class BankCreationFailedEvent {
  constructor(public readonly reason: string) {}
}
