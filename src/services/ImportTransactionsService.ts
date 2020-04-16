/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import csv from 'csvtojson';
import path from 'path';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(file: string): Promise<Request[]> {
    const createTransaction = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, file);

    const transactions = await csv().fromFile(filePath);

    async function processTransactions(
      transactionArray: Request[],
    ): Promise<void> {
      for (const transaction of transactionArray) {
        const { title, type, value, category } = transaction;

        await createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      }
    }

    await processTransactions(transactions);

    // Deletar arquivo após a importação
    const csvFileExists = await fs.promises.stat(filePath);

    if (csvFileExists) {
      await fs.promises.unlink(filePath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
