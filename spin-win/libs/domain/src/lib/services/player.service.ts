import { Player, PlayerAggregate, IPlayerRepository } from '@domain';

export class PlayerDomainService {
  constructor(
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async depositMoney(playerId: number, amount: number): Promise<Player> {
    const player = await this.playerRepository.getById(playerId);
    
    if (!player) {
      throw new Error('Player not found');
    }

    const playerAggregate = new PlayerAggregate().init(player);

    playerAggregate.depositMoney(amount);

    const updatedPlayer = await this.playerRepository.update(playerAggregate.toPlayer());
    playerAggregate.commit();

    return updatedPlayer;
  }
}
