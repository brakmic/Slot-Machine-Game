import { Repository } from 'typeorm';
import { SlotModel } from '@db-models';
import { Slot, ISlotRepository } from '@domain';

/**
 * Repository for writing slot data
 */
export class SlotWriteRepository implements ISlotRepository {
  constructor(private repository: Repository<SlotModel>) {}

  async save(slot: Slot): Promise<Slot> {
    const slotModel = SlotModel.fromDomain(slot);
    const savedModel = await this.repository.save(slotModel);
    return SlotModel.toDomain(savedModel);
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
