export class UpdateLeaderboardEntryCommand {
  constructor(
    public readonly playerId: number,
    public readonly playerName: string,
    public readonly spinResult: { winnings: number }
  ) {}
}
