import { IRepository } from '@spin-win/infrastructure';
import { Bank, IBankRepository } from '@spin-win/domain';
import { BankModel } from '@spin-win/db-models';

export class BankReadRepository implements IBankRepository {
  constructor(private readonly repo: IRepository<BankModel>) {}
  
  create(bank: Bank): Promise<Bank> {
    throw new Error("Not supported");
  }

  update(bank: Bank): Promise<Bank> {
    throw new Error("Not supported");
  }

  delete(id: number): Promise<void> {
    throw new Error("Not supported");
  }

  async getById(id: number): Promise<Bank | undefined> {
    if (!id) {
      return null;
    }  

    const bankModel = await this.repo.getById(id);
    return bankModel ? BankModel.toDomain(bankModel) : null;   
  }
  

  async getAll(): Promise<Bank[]> {
    const bankModels = await this.repo.getAll();
    return bankModels.map(BankModel.toDomain);
  }
}

export default BankReadRepository;
