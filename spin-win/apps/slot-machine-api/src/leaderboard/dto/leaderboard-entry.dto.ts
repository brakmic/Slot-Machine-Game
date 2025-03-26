import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntryDto {
  @ApiProperty({
    description: 'ID of the player',
    example: 1
  })
  playerId: number;

  @ApiProperty({
    description: 'Name of the player',
    example: 'JohnDoe'
  })
  playerName: string;

  @ApiProperty({
    description: 'Total number of spins by the player',
    example: 42
  })
  totalSpins: number;

  @ApiProperty({
    description: 'Total winnings of the player',
    example: 1250.5
  })
  totalWinnings: number;

  @ApiProperty({
    description: 'Biggest single win of the player',
    example: 500
  })
  biggestWin: number;

  @ApiProperty({
    description: 'Current rank of the player on the leaderboard',
    example: 3
  })
  rank: number;
}
