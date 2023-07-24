import { Bank } from "@spin-win/domain";

export interface IBankRepository {
  create(bank: Bank): Promise<Bank>;
  update(bank: Bank): Promise<Bank>;
  delete(id: number): Promise<void>;
  getById(id: number): Promise<Bank | undefined>;
  getAll(): Promise<Bank[]>;
}
