import { IRepository } from '@infrastructure';
import { Player, IPlayerRepository } from '@domain';
import { PlayerModel } from '@db-models';

export class PlayerReadRepository implements IPlayerRepository {
  constructor(private readonly repo: IRepository<PlayerModel>) {}
  
  create(player: Player): Promise<Player> {
    throw new Error("Not supported");
  }

  update(player: Player): Promise<Player> {
    throw new Error("Not supported");
  }

  delete(id: number): Promise<void> {
    throw new Error("Not supported");
  }

  async getById(id: number): Promise<Player | undefined> {
    if (!id) {
      return null;
    }  

    const playerModel = await this.repo.getById(id);
    return playerModel ? PlayerModel.toDomain(playerModel) : null;
  }
  

  async getAll(): Promise<Player[]> {
    const playerModels = await this.repo.getAll();
    return playerModels.map(PlayerModel.toDomain);
  }
}

export default PlayerReadRepository;
