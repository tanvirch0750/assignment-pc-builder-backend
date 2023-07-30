import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { categoryFilterableFields } from './category.constant';
import { ICategory } from './category.interface';
import { CategoryServices } from './category.services';

const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const category = req.body;
  const result = await CategoryServices.createCategoryToDB(category);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategory: RequestHandler = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, categoryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CategoryServices.getAllCategoryFromDB(
    filters,
    paginationOptions
  );

  if (result.data.length === 0) {
    return next(new ApiError('No Categories found!', httpStatus.NOT_FOUND));
  }

  sendResponse<ICategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Category retrived successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCategory: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await CategoryServices.getSingleCategoryFromDB(id);

  if (!result) {
    return next(
      new ApiError(`No Category found with this ${id} id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Category retrived successfully',
    data: result,
  });
});

const updateCategory: RequestHandler = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;

  const updatedData = req.body;

  const result = await CategoryServices.updateSingleCategoryToDB(
    categoryId,
    updatedData
  );

  if (!result) {
    return next(new ApiError(`No Category found with this ID`, 404));
  }

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const result = await CategoryServices.deleteCategoryFromDB(id);

  if (!result) {
    return next(
      new ApiError(`No Category found with this ${id} id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Category deleted successfully !',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
