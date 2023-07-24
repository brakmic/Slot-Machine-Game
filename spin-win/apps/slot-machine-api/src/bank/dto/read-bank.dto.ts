import { IBankDto } from "@spin-win/infrastructure";

export class ReadBankDto implements IBankDto {
  constructor(public id: number, public balance: number) {}
}
