import { ApiProperty } from '@nestjs/swagger';

export class DepositMoneyDto {
  @ApiProperty()
  amount: number;
}
