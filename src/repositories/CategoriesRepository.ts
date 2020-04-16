import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByTitle(title: string): Promise<Category | null> {
    const findCategory = await this.findOne({
      where: { title },
    });

    return findCategory || null;
  }

  public async findById(id: string): Promise<Category | null> {
    // <string | null> {
    const findCategory = await this.findOne({
      where: { id },
    });

    if (!findCategory) {
      return null;
    }

    return findCategory;
  }
}

export default CategoriesRepository;
