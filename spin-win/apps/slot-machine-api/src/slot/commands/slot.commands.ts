import { SlotSymbol } from '@domain';

export class CreateSlotCommand {
  constructor(
    public readonly symbol: SlotSymbol | string
  ) {}
}
