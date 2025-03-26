export class GetSlotByIdQuery {
  constructor(public readonly id: number) {}
}

export class GetAllSlotsQuery {}

export class GetRandomSymbolsQuery {
  constructor(public readonly count: number) {}
}

