import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BankModule } from '@bank/bank.module';
import { PlayerModule } from '@player/player.module';
import { SlotModule } from '@slot/slot.module';
import { SpinModule } from '@spin/spin.module';
import { LeaderboardModule } from '@leaderboard/leaderboard.module';
import { DatabaseModule } from 'apps/slot-machine-api/src/common/persistence/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    BankModule,
    PlayerModule,
    SlotModule,
    SpinModule,
    LeaderboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
