import { Router } from 'express';
import { asyncHandler } from '../utils/errorHandlers.js';
import {
  getTasks,
  createTask,
  updateTaskStatus,
} from '../controllers/taskController.js';

const router = Router();

router.get('/', asyncHandler(getTasks));
router.post('/', asyncHandler(createTask));
router.patch('/:taskId/status', asyncHandler(updateTaskStatus));

export default router;
