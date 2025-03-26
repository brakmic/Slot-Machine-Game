import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ExecuteSpinDto {
  @IsNotEmpty()
  @IsNumber()
  playerId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  betAmount: number;
}
