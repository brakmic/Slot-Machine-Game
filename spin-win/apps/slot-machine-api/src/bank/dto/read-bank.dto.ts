import { IBankDto } from "@infrastructure";

export class ReadBankDto implements IBankDto {
  constructor(public id: number, public balance: number) {}
}
