import { Player, IPlayerRepository } from '@domain';
import { IRepository } from '@infrastructure';
import { PlayerModel } from '@db-models';

export class PlayerWriteRepository implements IPlayerRepository {
  constructor(private readonly repo: IRepository<PlayerModel>) {}

  async create(player: Player): Promise<Player> {
    const playerModel = PlayerModel.fromDomain(player);
    const createdPlayerModel = await this.repo.create(playerModel);
    return PlayerModel.toDomain(createdPlayerModel);
  }

  async update(player: Player): Promise<Player> {
    const playerModel = PlayerModel.fromDomain(player);
    const updatedPlayerModel = await this.repo.update(playerModel);
    return PlayerModel.toDomain(updatedPlayerModel);
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async getById(id: number): Promise<Player | undefined> {
    const playerModel = await this.repo.getById(id);
    return playerModel ? PlayerModel.toDomain(playerModel) : undefined;
  }

  async getAll(): Promise<Player[]> {
    const playerModels = await this.repo.getAll();
    return playerModels.map(PlayerModel.toDomain);
  }
}
