import { Entity, Column, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { Spin, SpinOutcome } from '@domain';

const spinOutcomeTransformer: ValueTransformer = {
  from: (dbValue: string): SpinOutcome => {
    return dbValue as SpinOutcome;
  },
  to: (entityValue: SpinOutcome): string => {
    return entityValue;
  },
};

@Entity()
export class SpinModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerId: number;
  
  @Column('simple-array')
  symbols: string[];

  @Column({
    type: "text",
    transformer: spinOutcomeTransformer
  })
  outcome: SpinOutcome;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  winnings: number;

  @Column({ type: 'datetime' })
  timestamp: Date;

  static toDomain(spinModel: SpinModel): Spin {
    return new Spin(
      spinModel.id, 
      spinModel.playerId, 
      spinModel.symbols,
      spinModel.outcome, 
      spinModel.winnings, 
      spinModel.timestamp
    );
  }

  static fromDomain(spin: Spin): SpinModel {
    const spinModel = new SpinModel();
    spinModel.id = spin.id;
    spinModel.playerId = spin.playerId;
    spinModel.symbols = spin.symbols;
    spinModel.outcome = spin.outcome;
    spinModel.winnings = spin.winnings;
    spinModel.timestamp = spin.timestamp;
    return spinModel;
  }
}
