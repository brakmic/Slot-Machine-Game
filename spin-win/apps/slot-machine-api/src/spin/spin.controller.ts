import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ExecuteSpinCommand } from './commands/spin.commands';
import { GetSpinByIdQuery, GetSpinsByPlayerQuery } from './queries/spin.queries';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExecuteSpinDto } from './dto/execute-spin.dto';
import { SpinResultDto } from './dto/spin-result.dto';

@ApiTags('spins')
@Controller('spins')
export class SpinController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @ApiOperation({ summary: 'Execute a new spin' })
  @ApiResponse({ status: 201, description: 'Spin executed successfully' })
  async executeSpin(@Body() executeSpinDto: ExecuteSpinDto): Promise<void> {
    await this.commandBus.execute(
      new ExecuteSpinCommand(
        executeSpinDto.playerId,
        executeSpinDto.betAmount
      )
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a spin by ID' })
  @ApiResponse({ status: 200, description: 'Return the spin', type: SpinResultDto })
  async getSpinById(@Param('id') id: number): Promise<SpinResultDto> {
    return this.queryBus.execute(new GetSpinByIdQuery(id));
  }

  @Get('player/:playerId')
  @ApiOperation({ summary: 'Get all spins for a player' })
  @ApiResponse({ status: 200, description: 'Return the player spins', type: [SpinResultDto] })
  async getSpinsByPlayer(@Param('playerId') playerId: number): Promise<SpinResultDto[]> {
    return this.queryBus.execute(new GetSpinsByPlayerQuery(playerId));
  }
}
