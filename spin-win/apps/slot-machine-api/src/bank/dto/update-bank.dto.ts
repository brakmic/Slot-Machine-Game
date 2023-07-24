import { ApiProperty } from '@nestjs/swagger';

export class UpdateBankDto {
  @ApiProperty()
  balance: number;
}
