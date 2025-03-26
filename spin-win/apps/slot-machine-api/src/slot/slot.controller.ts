import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateSlotCommand } from './commands/slot.commands';
import { GetAllSlotsQuery, GetRandomSymbolsQuery, GetSlotByIdQuery } from './queries/slot.queries';
import { CreateSlotDto } from './dto/create-slot.dto';
import { SlotResultDto } from './dto/slot-result.dto';

@ApiTags('slots')
@Controller('slots')
export class SlotController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new slot' })
  @ApiResponse({ status: 201, description: 'Slot created successfully' })
  async createSlot(@Body() createSlotDto: CreateSlotDto): Promise<void> {
    await this.commandBus.execute(
      new CreateSlotCommand(createSlotDto.symbol)
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a slot by ID' })
  @ApiResponse({ status: 200, description: 'Return the slot', type: SlotResultDto })
  async getSlotById(@Param('id') id: number): Promise<SlotResultDto> {
    return this.queryBus.execute(new GetSlotByIdQuery(id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all slots' })
  @ApiResponse({ status: 200, description: 'Return all slots', type: [SlotResultDto] })
  async getAllSlots(): Promise<SlotResultDto[]> {
    return this.queryBus.execute(new GetAllSlotsQuery());
  }

  @Get('random/symbols')
  @ApiOperation({ summary: 'Get random slot symbols' })
  @ApiResponse({ status: 200, description: 'Return random symbols', type: [String] })
  @ApiQuery({ name: 'count', type: Number, required: false, description: 'Number of symbols to generate' })
  async getRandomSymbols(@Query('count') count = 3): Promise<string[]> {
    return this.queryBus.execute(new GetRandomSymbolsQuery(count));
  }
}
