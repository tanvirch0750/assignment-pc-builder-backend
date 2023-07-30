import { IStatus } from './product.interface';

export const status: IStatus[] = ['In Stock', 'Out of Stock'];

export const productSearchableFields = [
  'productName',
  'category',
  'status',
  'price',
];

export const productFilterableFields = [
  'productName',
  'category',
  'status',
  'price',
];
