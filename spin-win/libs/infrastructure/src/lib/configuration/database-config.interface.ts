export interface IDatabaseConfig {
  type: 'postgres' | 'mysql' | 'sqlite' | 'mssql' | 'oracle';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}
