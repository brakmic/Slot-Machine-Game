import { EventPublisher } from '@nestjs/cqrs';
import { ISlotRepository } from '../repositories/slot.repository';
import { SlotAggregate } from '../aggregates/slot.aggregate';
import { SlotSymbol } from '../types/slot-symbol.enum';

/**
 * Domain service for managing slots
 */
export class SlotDomainService {
  constructor(
    private readonly slotRepository: ISlotRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  /**
   * Creates a new slot with the given symbol
   * @param id ID of the slot to create
   * @param symbol Symbol to assign to the slot
   */
  async createSlot(id: number, symbol: SlotSymbol | string): Promise<void> {
    const slotAggregate = this.eventPublisher.mergeObjectContext(
      new SlotAggregate(id)
    );
    
    slotAggregate.createSlot(symbol);
    
    // Create a domain entity from the aggregate
    const slot = {
      id: slotAggregate.id,
      symbol: slotAggregate.symbol
    };
    
    // Save the entity
    await this.slotRepository.save(slot);
    
    // Commit events
    slotAggregate.commit();
  }

  /**
   * Get all available slot symbols
   */
  getAllSymbols(): string[] {
    return Object.values(SlotSymbol);
  }

  /**
   * Get a random slot symbol
   */
  getRandomSymbol(): string {
    const symbols = this.getAllSymbols();
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  }
  
  /**
   * Generate a random series of symbols for a spin
   * @param count Number of symbols to generate
   */
  generateRandomSymbols(count: number): string[] {
    return Array.from({ length: count }, () => this.getRandomSymbol());
  }
}
