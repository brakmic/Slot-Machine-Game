import { AggregateRoot } from '@nestjs/cqrs';
import { SlotSymbol } from '../types/slot-symbol.enum';
import { SlotCreatedEvent } from '../events/slot.events';

/**
 * Slot Aggregate Root
 */
export class SlotAggregate extends AggregateRoot {
  private _id: number;
  private _symbol: string;

  constructor(id: number) {
    super();
    this._id = id;
  }

  /**
   * Get the slot ID
   */
  get id(): number {
    return this._id;
  }

  /**
   * Get the symbol
   */
  get symbol(): string {
    return this._symbol;
  }

  /**
   * Creates a new slot with the given symbol
   * @param symbol The symbol to assign to the slot
   */
  createSlot(symbol: SlotSymbol | string) {
    this._symbol = symbol;
    this.apply(new SlotCreatedEvent(this._id, this._symbol));
  }
}
