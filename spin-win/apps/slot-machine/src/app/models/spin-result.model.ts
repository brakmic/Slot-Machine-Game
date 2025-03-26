export enum SpinOutcome {
  LOSS = 'LOSS',
  SMALL_WIN = 'SMALL_WIN',
  WIN = 'WIN',
  BIG_WIN = 'BIG_WIN',
  JACKPOT = 'JACKPOT'
}

export interface SpinResult {
  id: number;
  playerId: number;
  symbols: string[];
  outcome: SpinOutcome;
  winnings: number;
  timestamp: Date;
}
