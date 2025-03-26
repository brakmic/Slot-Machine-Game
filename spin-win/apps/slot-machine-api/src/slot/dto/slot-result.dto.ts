import { ApiProperty } from '@nestjs/swagger';

export class SlotResultDto {
  @ApiProperty({
    description: 'Unique identifier of the slot',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Symbol displayed in the slot',
    example: '🍒'
  })
  symbol: string;
}
