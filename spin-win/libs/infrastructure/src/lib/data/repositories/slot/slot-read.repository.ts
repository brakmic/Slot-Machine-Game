import { Repository } from 'typeorm';
import { SlotModel } from '@db-models';
import { Slot, ISlotRepository } from '@domain';

/**
 * Repository for reading slot data
 */
export class SlotReadRepository implements ISlotRepository {
  constructor(private repository: Repository<SlotModel>) {}

  async save(slot: Slot): Promise<Slot> {
    throw new Error('Read repository cannot save entities');
  }

  async findById(id: number): Promise<Slot | null> {
    const slotModel = await this.repository.findOne({ where: { id } });
    if (!slotModel) {
      return null;
    }
    return SlotModel.toDomain(slotModel);
  }

  async findAll(): Promise<Slot[]> {
    const slotModels = await this.repository.find();
    return slotModels.map(SlotModel.toDomain);
  }
}
