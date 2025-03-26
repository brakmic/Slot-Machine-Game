import { EventPublisher } from '@nestjs/cqrs';
import { ISpinRepository } from '../repositories/spin.repository';
import { SpinAggregate } from '../aggregates/spin.aggregate';

export class SpinDomainService {
  constructor(
    private readonly spinRepository: ISpinRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async executeSpin(id: number, playerId: number, betAmount: number): Promise<void> {
    const spinAggregate = this.eventPublisher.mergeObjectContext(
      new SpinAggregate(id, playerId)
    );
    
    spinAggregate.executeSpin(betAmount);
    
    // Create a domain entity from the aggregate
    const spin = {
      id: spinAggregate.id,
      playerId: spinAggregate.playerId,
      symbols: spinAggregate.symbols,
      outcome: spinAggregate.outcome,
      winnings: spinAggregate.winnings,
      timestamp: spinAggregate.timestamp
    };
    
    // Save the entity
    await this.spinRepository.save(spin);
    
    // Commit events
    spinAggregate.commit();
  }
}
