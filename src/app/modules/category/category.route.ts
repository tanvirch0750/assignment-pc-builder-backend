import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from './category.validation';

const router = express.Router();

router.get('/:id', CategoryController.getSingleCategory);

router.patch(
  '/:id',
  validateRequest(updateCategoryZodSchema),
  CategoryController.updateCategory
);

router.delete('/:id', CategoryController.deleteCategory);

router.post(
  '/',
  validateRequest(createCategoryZodSchema),
  CategoryController.createCategory
);

router.get('/', CategoryController.getAllCategory);

export default router;
