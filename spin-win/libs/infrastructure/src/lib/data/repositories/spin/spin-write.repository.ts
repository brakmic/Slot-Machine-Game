import { Repository } from 'typeorm';
import { SpinModel } from '@db-models';
import { Spin, ISpinRepository } from '@domain';

export class SpinWriteRepository implements ISpinRepository {
  constructor(private repository: Repository<SpinModel>) {}

  async save(spin: Spin): Promise<Spin> {
    const spinModel = SpinModel.fromDomain(spin);
    const savedModel = await this.repository.save(spinModel);
    return SpinModel.toDomain(savedModel);
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
