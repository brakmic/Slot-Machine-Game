import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreatePlayerCommand,
  DepositMoneyCommand,
  DeletePlayerCommand,
} from '@player/commands/player.commands';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlayerDto } from '@player/dto/create-player.dto';
import { DepositMoneyDto } from '@player/dto/deposit-money.dto';
import {
  GetAllPlayersQuery,
  GetPlayerByIdQuery,
} from '@player/queries/player.queries';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get(':id')
  async getPlayerById(@Param('id') id: string) {
    return await this.queryBus.execute(new GetPlayerByIdQuery(Number(id)));
  }

  @Get()
  async getAllPlayers() {
    return await this.queryBus.execute(new GetAllPlayersQuery());
  }

  @Post()
  async createPlayer(@Body() data: CreatePlayerDto) {
    return await this.commandBus.execute(
      new CreatePlayerCommand(data.name, data.balance)
    );
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string) {
    return await this.commandBus.execute(new DeletePlayerCommand(Number(id)));
  }

  @Put(':id')
  async depositMoney(@Param('id') id: string, @Body() data: DepositMoneyDto) {
    return await this.commandBus.execute(
      new DepositMoneyCommand(Number(id), data.amount)
    );
  }
}
