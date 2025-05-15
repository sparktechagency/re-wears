import express from 'express';
import { ColorController } from './color.controller';

const router = express.Router();

router.get('/', ColorController); 

export const ColorRoutes = router;
