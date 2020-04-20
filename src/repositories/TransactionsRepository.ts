import { EntityRepository, Repository } from 'typeorm';

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
}

export default TransactionsRepository;
