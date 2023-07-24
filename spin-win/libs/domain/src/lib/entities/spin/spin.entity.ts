export enum SpinOutcome {
  WIN = 'WIN',
  LOSE = 'LOSE'
}

export class Spin {
  constructor(
    public id: number,
    public playerId: number,
    public outcome: SpinOutcome,
    public winnings: number,
    public timestamp: Date,
  ) {}
}
