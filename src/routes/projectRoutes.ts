import { Router } from 'express';
import { asyncHandler } from '../utils/errorHandlers.js';
import {
  getProjects,
  createProject,
} from '../controllers/projectController.js';

const router = Router();

router.get('/', asyncHandler(getProjects));
router.post('/', asyncHandler(createProject));

export default router;
