import { Injectable } from '@nestjs/common';
import { IDatabaseConfig } from '@infrastructure';

@Injectable()
export class DatabaseConfigService {
  getDatabaseConfig(): IDatabaseConfig {
    // Default to SQLite if no environment variables are set
    return {
      type: (process.env.DB_TYPE as 'postgres' | 'mysql' | 'sqlite' | 'mssql' | 'oracle') || 'sqlite',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'spin-win.sqlite',
      synchronize: process.env.DB_SYNCHRONIZE !== 'false', // Default to true
    };
  }
}
