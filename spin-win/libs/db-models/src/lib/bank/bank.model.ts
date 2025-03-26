import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Bank } from '@domain';


@Entity()
export class BankModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  balance: number;

  static toDomain(bankModel: BankModel): Bank {
    return new Bank(bankModel.id, bankModel.balance);
  }

  static fromDomain(bank: Bank): BankModel {
    const bankModel = new BankModel();
    bankModel.id = bank.id;
    bankModel.balance = bank.balance;
    return bankModel;
  }
}

