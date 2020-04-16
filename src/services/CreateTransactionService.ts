import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type !== 'outcome' && type !== 'income') {
      throw new AppError('Invalid type of transaction', 400);
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError(
        "There's not enough money on your balance to complete this transaction",
        400,
      );
    }

    const createCategory = new CreateCategoryService();

    const categoryObject = await createCategory.execute(category);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryObject.id,
      // category: categoryObject,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
