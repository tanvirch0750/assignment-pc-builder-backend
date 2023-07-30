/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { productSearchableFields } from './product.constant';
import { IProduct, IProductFilters } from './product.interface';
import { Product } from './product.model';

const createProductToDB = async (product: IProduct): Promise<IProduct> => {
  const createProduct = (await Product.create(product)).populate('category');
  return createProduct;
};

const getAllProductFromDB = async (
  filters: IProductFilters,
  paginationOptions: IpaginationOptions
): Promise<IGenericPaginationResponse<IProduct[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filtersData,
    productSearchableFields
  );

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Product.find(whereConditions)
    .populate('category')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProductFromDB = async (
  id: string
): Promise<IProduct | null | undefined> => {
  const result = (await Product.findById(id))?.populate('category');
  return result;
};

const updateSingleProductToDB = async (
  id: string,
  updatedData: Partial<IProduct>
): Promise<IProduct | null | undefined> => {
  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new ApiError(`No product found with this ID`, 404);
  }

  if (updatedData.individualRating) {
    const rating = updatedData?.individualRating;

    if (isNaN(rating!) || rating! < 1 || rating! > 5) {
      throw new ApiError(
        `Invalid rating value. Please provide a rating between 1 and 5.`,
        400
      );
    }
    const newAverageRating =
      (product.averageRating * product.totalRatings + rating!) /
      (product.totalRatings + 1);
    product.averageRating = newAverageRating;
    product.totalRatings += 1;
    await product.save();
  }

  const result = (
    await Product.findOneAndUpdate({ _id: id }, updatedData, {
      new: true,
    })
  )?.populate('category');

  return result;
};

const deleteProductFromDB = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new ApiError(`No product found with this ID`, 404);
  } else {
    const result = await Product.findByIdAndDelete(id);
    return result;
  }
};

export const ProductServices = {
  createProductToDB,
  getAllProductFromDB,
  getSingleProductFromDB,
  updateSingleProductToDB,
  deleteProductFromDB,
};
