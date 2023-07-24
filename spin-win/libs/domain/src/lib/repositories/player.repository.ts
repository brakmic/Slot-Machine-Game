import { Player } from "@spin-win/domain";

export interface IPlayerRepository {
  create(player: Player): Promise<Player>;
  update(player: Player): Promise<Player>;
  delete(id: number): Promise<void>;
  getById(id: number): Promise<Player | undefined>;
  getAll(): Promise<Player[]>;
}
