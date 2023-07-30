import { Model } from 'mongoose';

export type ICategory = {
  category: string;
  id?: string;
  featured: boolean;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;

export type ICategoryFilters = {
  searchTerm?: string;
  id?: string;
  category?: string;
  featured?: boolean;
};
