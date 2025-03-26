export class SpinExecutedEvent {
  constructor(
    public readonly playerId: number,
    public readonly betAmount: number
  ) {}
}

import { SpinOutcome } from '../types/spin-outcome.enum';

export class SpinOutcomeGeneratedEvent {
  constructor(
    public readonly playerId: number,
    public readonly outcome: SpinOutcome,
    public readonly winnings: number
  ) {}
}
