import { IPlayerDto } from '@infrastructure';

export class ReadPlayerDto implements IPlayerDto {
  constructor(public id: number, public name: string, public balance: number) {}
}
