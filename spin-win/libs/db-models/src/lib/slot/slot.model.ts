import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Slot } from '@domain';

@Entity()
export class SlotModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  static toDomain(slotModel: SlotModel): Slot {
    return new Slot(slotModel.id, slotModel.symbol);
  }

  static fromDomain(slot: Slot): SlotModel {
    const slotModel = new SlotModel();
    slotModel.id = slot.id;
    slotModel.symbol = slot.symbol;
    return slotModel;
  }
}
