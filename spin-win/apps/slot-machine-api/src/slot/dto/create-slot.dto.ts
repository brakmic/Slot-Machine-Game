import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSlotDto {
  @ApiProperty({
    description: 'Symbol to display in the slot',
    example: '🍒'
  })
  @IsNotEmpty()
  @IsString()
  symbol: string;
}
