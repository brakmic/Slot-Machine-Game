export class GetAllPlayersQuery {}

export class GetPlayerByIdQuery {
  constructor(public readonly id: number) {}
}
