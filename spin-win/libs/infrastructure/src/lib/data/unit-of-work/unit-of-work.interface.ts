import { IRepository } from '../repositories/repository.interface';

export interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;

  getRepository<T>(entity: { new (): T }): IRepository<T>;
}
