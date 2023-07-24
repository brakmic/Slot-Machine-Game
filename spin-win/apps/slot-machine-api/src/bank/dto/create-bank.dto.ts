import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDto {
  @ApiProperty({ default: 0 })
  balance: number;
}
