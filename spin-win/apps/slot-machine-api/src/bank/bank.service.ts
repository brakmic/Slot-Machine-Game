import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ICommandHandler, CommandHandler,
  IQueryHandler, QueryHandler, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BankReceivedDepositEvent, BankDomainService, Bank,
  BankCreatedSuccessfullyEvent, BankCreationFailedEvent } from '@domain';
import { IRepository } from '@infrastructure';
import { CreateBankCommand, UpdateBankCommand } from './commands/bank.commands';
import { GetBankQuery } from './queries/bank.queries';

@Injectable()
@CommandHandler(CreateBankCommand)
export class CreateBankHandler implements ICommandHandler<CreateBankCommand> {
  constructor(
    @Inject('BankDomainService')
    private readonly bankDomainService: BankDomainService,
  ) {}

  async execute(command: CreateBankCommand) {
    const newBank = new Bank(undefined, command.balance);
    return await this.bankDomainService.createBank(newBank);
  }
}

@Injectable()
@CommandHandler(UpdateBankCommand)
export class UpdateBankHandler implements ICommandHandler<UpdateBankCommand> {
  constructor(
    @Inject('BankDomainService')
    private readonly bankDomainService: BankDomainService,
  ) {}

  async execute(command: UpdateBankCommand) {
    await this.bankDomainService.depositMoney(command.bankId, command.amount);
  }
}

// Events
@Injectable()
@EventsHandler(BankReceivedDepositEvent)
export class BalanceUpdatedHandler implements IEventHandler<BankReceivedDepositEvent> {
  constructor(
    @Inject('BankReadRepository')
    private readonly bankRepository: IRepository<Bank>
  ) {}

 async handle(event: BankReceivedDepositEvent) {
    console.log(`Bank received a deposit of ${event.amount}`);
    const bank = await this.bankRepository.getById(event.bankId);
    console.log(`Current bank balance is ${bank.balance}`);
  }
}

@Injectable()
@EventsHandler(BankCreatedSuccessfullyEvent)
export class BankCreatedSuccessfullyHandler implements IEventHandler<BankCreatedSuccessfullyEvent> {
  async handle(event: BankCreatedSuccessfullyEvent) {
    console.log(`Bank created successfully with id: ${event.bankId}`);
  }
}

@Injectable()
@EventsHandler(BankCreationFailedEvent)
export class BankCreationFailedHandler implements IEventHandler<BankCreationFailedEvent> {
  async handle(event: BankCreationFailedEvent) {
    console.log(`Bank creation failed with message: ${event.reason}`);
  }
}

// Query
@Injectable()
@QueryHandler(GetBankQuery)
export class GetBankHandler implements IQueryHandler<GetBankQuery> {
  constructor(
    @Inject('BankReadRepository')
    private readonly bankRepository: IRepository<Bank>,
  ) {}

  async execute(query: GetBankQuery): Promise<Bank> {
    return this.bankRepository.getById(query.id);
  }
}
