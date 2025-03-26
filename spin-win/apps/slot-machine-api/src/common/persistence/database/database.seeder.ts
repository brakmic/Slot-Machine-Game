import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBankCommand } from '@bank/commands/bank.commands';

@Injectable()
export class DatabaseSeeder {
  constructor(private readonly commandBus: CommandBus) {
    console.log('DatabaseSeeder constructed');
  }

  async seed() {
    console.log('Starting database seeding...');
    
    try {
      const command = new CreateBankCommand(100000);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
