import { Router } from 'express';
import { asyncHandler } from '../utils/errorHandlers';
import { getProjects, createProject } from '../controllers/projectController';

const router = Router();

router.get('/', asyncHandler(getProjects));
router.post('/', asyncHandler(createProject));

export default router;
