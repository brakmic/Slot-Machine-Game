import { EventPublisher } from '@nestjs/cqrs';
import { Bank, BankAggregate, BankCreatedSuccessfullyEvent, BankCreationFailedEvent, IBankRepository } from '@spin-win/domain';

export class BankDomainService {
  constructor(
    private readonly bankRepository: IBankRepository,
    private readonly publisher: EventPublisher,
  ) {}
  

  async createBank(bank: Bank): Promise<Bank> {
    const existingBanks = await this.bankRepository.getAll();
    if (existingBanks.length > 0) {
      const bankAggregate = new BankAggregate().init(bank);
      const bankAggregateWithPublisher = this.publisher.mergeObjectContext(bankAggregate);
      bankAggregateWithPublisher.apply(new BankCreationFailedEvent('Bank already exists'));
      bankAggregateWithPublisher.commit();
      throw new Error('Bank already exists');
    }
  
    const bankAggregate = new BankAggregate().init(bank);
    const bankAggregateWithPublisher = this.publisher.mergeObjectContext(bankAggregate);
    bankAggregateWithPublisher.apply(new BankCreatedSuccessfullyEvent(bank.id));
    
    const newBank = await this.bankRepository.create(bankAggregate.toBank());
    bankAggregateWithPublisher.commit();
  
    return newBank;
  }
  
  async depositMoney(bankId: number, amount: number): Promise<Bank> {
    const bank = await this.bankRepository.getById(bankId);
    
    if (!bank) {
      throw new Error('Bank not found');
    }
  
    const bankAggregate = new BankAggregate().init(bank);
    const bankAggregateWithPublisher = this.publisher.mergeObjectContext(bankAggregate);
    bankAggregateWithPublisher.depositMoney(amount);
    
    const updatedBank = await this.bankRepository.update(bankAggregate.toBank());
    bankAggregateWithPublisher.commit();
  
    return updatedBank;
  }
  
  async withdrawMoney(bankId: number, amount: number): Promise<Bank> {
    const bank = await this.bankRepository.getById(bankId);
  
    if (!bank) {
      throw new Error('Bank not found');
    }
  
    const bankAggregate = new BankAggregate().init(bank);
    const bankAggregateWithPublisher = this.publisher.mergeObjectContext(bankAggregate);
    bankAggregateWithPublisher.withdrawMoney(amount);
    
    const updatedBank = await this.bankRepository.update(bankAggregate.toBank());
    bankAggregateWithPublisher.commit();
  
    return updatedBank;
  }  
}
