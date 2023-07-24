export interface IRepository<T> {
  getById(id: number | string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: number | string): Promise<void>;
}
