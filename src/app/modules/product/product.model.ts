import { Schema, model } from 'mongoose';

import { status } from './product.constant';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    image: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: String, enum: status, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    keyFeatures: { type: [String], required: true },
    individualRating: { type: Number, default: 5 },
    averageRating: { type: Number, default: 5 },
    totalRatings: { type: Number, default: 1 },
    reviews: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Product = model<IProduct, ProductModel>('Products', productSchema);
