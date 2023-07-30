import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { productFilterableFields } from './product.constant';
import { IProduct } from './product.interface';
import { ProductServices } from './product.services';

const createProduct: RequestHandler = catchAsync(async (req, res) => {
  const product = req.body;
  const result = await ProductServices.createProductToDB(product);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts: RequestHandler = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, productFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ProductServices.getAllProductFromDB(
    filters,
    paginationOptions
  );

  if (result.data.length === 0) {
    return next(new ApiError('No products found!', httpStatus.NOT_FOUND));
  }

  sendResponse<IProduct[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product retrived successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await ProductServices.getSingleProductFromDB(id);

  if (!result) {
    return next(
      new ApiError(`No product found with this ${id} id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product retrived successfully',
    data: result,
  });
});

const updateProduct: RequestHandler = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const updatedData = req.body;

  const result = await ProductServices.updateSingleProductToDB(
    productId,
    updatedData
  );

  if (!result) {
    return next(new ApiError(`No product found with this ID`, 404));
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const result = await ProductServices.deleteProductFromDB(id);

  if (!result) {
    return next(
      new ApiError(`No Product found with this ${id} id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product deleted successfully !',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
