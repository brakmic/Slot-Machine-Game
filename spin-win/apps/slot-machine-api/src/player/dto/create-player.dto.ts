import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  balance: number;
}
