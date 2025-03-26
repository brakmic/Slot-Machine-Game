export class GetSpinByIdQuery {
  constructor(public readonly id: number) {}
}

export class GetSpinsByPlayerQuery {
  constructor(public readonly playerId: number) {}
}
