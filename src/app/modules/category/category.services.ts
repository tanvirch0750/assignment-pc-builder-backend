import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { categorySearchableFields } from './category.constant';
import { ICategory, ICategoryFilters } from './category.interface';
import { Category } from './category.model';

const createCategoryToDB = async (category: ICategory): Promise<ICategory> => {
  const createCategory = await Category.create(category);
  return createCategory;
};

const getAllCategoryFromDB = async (
  filters: ICategoryFilters,
  paginationOptions: IpaginationOptions
): Promise<IGenericPaginationResponse<ICategory[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filtersData,
    categorySearchableFields
  );

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Category.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCategoryFromDB = async (
  id: string
): Promise<ICategory | null | undefined> => {
  const result = await Category.findById(id);
  return result;
};

const updateSingleCategoryToDB = async (
  id: string,
  updatedData: Partial<ICategory>
): Promise<ICategory | null | undefined> => {
  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new ApiError(`No category found with this ID`, 404);
  } else {
    const result = await Category.findOneAndUpdate({ _id: id }, updatedData, {
      new: true,
    });

    return result;
  }
};

const deleteCategoryFromDB = async (id: string): Promise<ICategory | null> => {
  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new ApiError(`No category found with this ID`, 404);
  } else {
    const result = await Category.findByIdAndDelete(id);
    return result;
  }
};

export const CategoryServices = {
  createCategoryToDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  updateSingleCategoryToDB,
  deleteCategoryFromDB,
};
