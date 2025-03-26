import { Spin } from '../entities/spin/spin.entity';

export interface ISpinRepository {
  save(spin: Spin): Promise<Spin>;
  findById(id: number): Promise<Spin | null>;
  findByPlayerId(playerId: number): Promise<Spin[]>;
}
