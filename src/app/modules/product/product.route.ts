import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',

  ProductController.updateProduct
);

router.delete('/:id', ProductController.deleteProduct);

router.post('/', ProductController.createProduct);

router.get('/', ProductController.getAllProducts);

export default router;
