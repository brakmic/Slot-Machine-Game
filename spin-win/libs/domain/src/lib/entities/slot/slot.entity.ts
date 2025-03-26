/**
 * Represents a slot entity in the domain
 * Slots are the basic elements that appear in the slot machine
 */
export class Slot {
  /**
   * Creates a new Slot instance
   * @param id Unique identifier of the slot
   * @param symbol Symbol displayed in the slot (e.g., '🍒', '7️⃣')
   */
  constructor(
    public readonly id: number,
    public readonly symbol: string
  ) {}
}
