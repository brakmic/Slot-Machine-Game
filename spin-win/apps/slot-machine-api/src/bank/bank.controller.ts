import { Controller, Get, Put, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBankQuery } from '@bank/queries/bank.queries';
import { CreateBankCommand, UpdateBankCommand } from '@bank/commands/bank.commands';
import { CreateBankDto } from '@bank/dto/create-bank.dto';
import { UpdateBankDto } from '@bank/dto/update-bank.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('bank')
@Controller('bank')
export class BankController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  async getBank() {
    // assuming there is only one bank in the system, with id = 1
    const bank = await this.queryBus.execute(new GetBankQuery(1));
    if (!bank) {
      throw new HttpException('Bank not found', HttpStatus.NOT_FOUND);
    }
    return bank;
  }

  @Post()
  async createBank(@Body() createBankDto: CreateBankDto) {
    // this can be executed only once
    return await this.commandBus.execute(new CreateBankCommand(createBankDto.balance));
  }

  @Put()
  async updateBank(@Body() updateBankDto: UpdateBankDto) {
    // assuming there is only one bank in the system, with id = 1
    return await this.commandBus.execute(new UpdateBankCommand(1, updateBankDto.balance));
  }
}

