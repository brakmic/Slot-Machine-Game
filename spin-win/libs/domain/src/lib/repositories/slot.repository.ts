import { Slot } from '../entities/slot/slot.entity';

/**
 * Interface for Slot repositories
 */
export interface ISlotRepository {
  /**
   * Save a slot to the repository
   * @param slot The slot to save
   * @returns The saved slot
   */
  save(slot: Slot): Promise<Slot>;

  /**
   * Find a slot by its ID
   * @param id The slot ID to find
   * @returns The found slot or null if not found
   */
  findById(id: number): Promise<Slot | null>;
  
  /**
   * Get all available slots
   * @returns Array of all slots
   */
  findAll(): Promise<Slot[]>;
}
