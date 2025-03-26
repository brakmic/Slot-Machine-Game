import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BankModule } from '@bank/bank.module';
import { PlayerModule } from '@player/player.module';
import { SlotModule } from '@slot/slot.module';
import { SpinModule } from '@spin/spin.module';
import { LeaderboardModule } from '@leaderboard/leaderboard.module';
import { DatabaseModule } from '@common/persistence/database/database.module';
import { DatabaseSeeder } from '@common/persistence/database/database.seeder';

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    BankModule,
    PlayerModule,
    SlotModule,
    SpinModule,
    LeaderboardModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseSeeder
  ],
})
export class AppModule {}
