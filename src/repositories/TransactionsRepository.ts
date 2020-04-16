import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
// import CategoriesRepository from './CategoriesRepository';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, incomeTransaction) => total + incomeTransaction.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(
        (total, outcomeTransaction) => total + outcomeTransaction.value,
        0,
      );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public async listTransactions(): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    // const categoriesRepository = getCustomRepository(CategoriesRepository);

    const transactions = await transactionsRepository.find();

    // transactions.map(async transaction => {
    //   transaction.category = await categoriesRepository.findById(
    //     transaction.category_id,
    //   );

    //   delete transaction.created_at;
    //   delete transaction.updated_at;
    //   delete transaction.category_id;
    // });

    return transactions;
  }
}

export default TransactionsRepository;
