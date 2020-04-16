import { getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categoryExists = await categoriesRepository.findByTitle(title);

    if (categoryExists) {
      return categoryExists;
    }

    const category = categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
