export class GetTopPlayersQuery {
  constructor(public readonly limit: number) {}
}

export class GetPlayerStatsQuery {
  constructor(public readonly playerId: number) {}
}

export class GetAllLeaderboardEntriesQuery {}

