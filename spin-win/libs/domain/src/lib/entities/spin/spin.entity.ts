import { SpinOutcome } from '../../types/spin-outcome.enum';

export class Spin {
  constructor(
    public readonly id: number,
    public readonly playerId: number,
    public readonly symbols: string[],
    public readonly outcome: SpinOutcome,
    public readonly winnings: number,
    public readonly timestamp: Date
  ) {}
}
