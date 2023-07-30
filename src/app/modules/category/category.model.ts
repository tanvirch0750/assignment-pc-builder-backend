import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    category: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema
);
