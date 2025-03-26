import { Bank, IBankRepository } from '@domain';
import { IRepository } from '@infrastructure';
import { BankModel } from '@db-models';

export class BankWriteRepository implements IBankRepository {
  constructor(private readonly repo: IRepository<BankModel>) {}

  async create(bank: Bank): Promise<Bank> {
    const bankModel = BankModel.fromDomain(bank);
    const createdBankModel = await this.repo.create(bankModel);
    return BankModel.toDomain(createdBankModel);
  }

  async update(bank: Bank): Promise<Bank> {
    const bankModel = BankModel.fromDomain(bank);
    const updatedBankModel = await this.repo.update(bankModel);
    return BankModel.toDomain(updatedBankModel);
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async getById(id: number): Promise<Bank | undefined> {
    const bankModel = await this.repo.getById(id);
    return bankModel ? BankModel.toDomain(bankModel) : undefined;
  }

  async getAll(): Promise<Bank[]> {
    const bankModels = await this.repo.getAll();
    return bankModels.map(BankModel.toDomain);
  }
}

export default BankWriteRepository;
