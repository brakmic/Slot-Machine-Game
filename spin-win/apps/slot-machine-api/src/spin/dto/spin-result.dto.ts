import { SpinOutcome } from '@domain';

export class SpinResultDto {
  id: number;
  playerId: number;
  symbols: string[];
  outcome: SpinOutcome;
  winnings: number;
  timestamp: Date;
}
