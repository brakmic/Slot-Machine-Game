import { Repository } from 'typeorm';
import { SpinModel } from '@db-models';
import { Spin, ISpinRepository } from '@domain';

export class SpinReadRepository implements ISpinRepository {
  constructor(private repository: Repository<SpinModel>) {}

  async save(spin: Spin): Promise<Spin> {
    throw new Error('Read repository cannot save entities');
  }

  async findById(id: number): Promise<Spin | null> {
    const spinModel = await this.repository.findOne({ where: { id } });
    if (!spinModel) {
      return null;
    }
    return SpinModel.toDomain(spinModel);
  }

  async findByPlayerId(playerId: number): Promise<Spin[]> {
    const spinModels = await this.repository.find({ where: { playerId } });
    return spinModels.map(SpinModel.toDomain);
  }
}
