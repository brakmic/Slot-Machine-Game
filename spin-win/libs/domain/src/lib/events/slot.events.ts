/**
 * Event emitted when a slot is created
 */
export class SlotCreatedEvent {
  constructor(
    public readonly slotId: number,
    public readonly symbol: string
  ) {}
}
