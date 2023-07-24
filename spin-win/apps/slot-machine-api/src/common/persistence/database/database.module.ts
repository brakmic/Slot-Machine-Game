import { Module } from '@nestjs/common';
import { database } from '@spin-win/infrastructure';

@Module({
  providers: [
    {
      provide: 'Database',
      useFactory: async () => {
        await database.initialize();
        return database;
      },
    },
  ],
  exports: ['Database'],
})
export class DatabaseModule {}
