import { Module, Global } from '@nestjs/common';
import { database } from '@infrastructure';
import { DatabaseConfigService } from '@common/config/database.config';

@Global()
@Module({
  providers: [
    DatabaseConfigService,
    {
      provide: 'Database',
      useFactory: async (configService: DatabaseConfigService) => {
        const config = configService.getDatabaseConfig();
        await database.initialize(config);
        return database;
      },
      inject: [DatabaseConfigService],
    },
  ],
  exports: ['Database'],
})
export class DatabaseModule {}
