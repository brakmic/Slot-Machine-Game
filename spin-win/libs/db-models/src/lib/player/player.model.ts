import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '@domain';

@Entity()
export class PlayerModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  balance: number;

  static toDomain(playerModel: PlayerModel): Player {
    return new Player(playerModel.id, playerModel.name, playerModel.balance);
  }

  static fromDomain(player: Player): PlayerModel {
    const playerModel = new PlayerModel();
    playerModel.id = player.id;
    playerModel.name = player.name;
    playerModel.balance = player.balance;
    return playerModel;
  }
}
