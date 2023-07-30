import { Model, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';

export type IStatus = 'In Stock' | 'Out of Stock';

export type IProduct = {
  image: string;
  productName: string;
  category: Types.ObjectId | ICategory | string;
  status: IStatus;
  price: string;
  description: string;
  keyFeatures: string[];
  individualRating: number;
  averageRating: number;
  totalRatings: number;
  reviews: string[];
  id?: string;
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;

export type IProductFilters = {
  searchTerm?: string;
  productName?: string;
  category?: string;
  status?: string;
  price?: string;
};
