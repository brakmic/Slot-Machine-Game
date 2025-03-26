import { createConnection, Connection, ConnectionOptions, ObjectType, QueryRunner } from 'typeorm';
import { IDatabaseConfig, IUnitOfWork, IRepository } from '@infrastructure';
import { PlayerModel, SpinModel, SlotModel, BankModel, LeaderboardEntryModel } from '@db-models';

class Database implements IUnitOfWork {
  private connection?: Connection;
  private queryRunner?: QueryRunner;

  async initialize(config?: IDatabaseConfig) {
    const dbConfig: ConnectionOptions = {
      type: config?.type || 'sqlite',
      host: config?.host || 'localhost',
      port: config?.port || undefined,
      username: config?.username || undefined,
      password: config?.password || undefined,
      database: config?.database || 'database.sqlite',
      entities: [
        PlayerModel,
        SpinModel,
        SlotModel,
        BankModel,
        LeaderboardEntryModel
      ],
      synchronize: config?.synchronize || true,
    };

    this.connection = await createConnection(dbConfig);
  }

  async startTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database connection is not initialized.');
    }
    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No transaction to commit.');
    }
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No transaction to rollback.');
    }
    await this.queryRunner.rollbackTransaction();
  }

  getRepository<T>(entity: ObjectType<T>): IRepository<T> {
    if (!this.connection) {
      throw new Error('Database connection is not initialized.');
    }

    const repo = this.connection.getRepository(entity);
    // return an object that implements IRepository and uses repo behind the scenes
    return {
      create: (entity: T) => repo.save(entity),
      update: (entity: T) => repo.save(entity),
      delete: async (id: any) => { await repo.delete(id); },
      getById: (id: any) => repo.findOneBy({id: id} as any),
      getAll: () => repo.find(),
    };
  }
}

export const database = new Database();
