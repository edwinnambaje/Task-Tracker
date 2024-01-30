import express from 'express';
import isAuthenticated from '../helpers/verifyToken';
import SubTasks from '../controllers/subTask.controller';

const router = express.Router();
router.post('/create/:taskId',isAuthenticated, SubTasks.createSubTask);
router.get('/:taskId',isAuthenticated, SubTasks.getAllSubTasksForTasks);
router.put('/complete/:subTaskId',isAuthenticated, SubTasks.completeSubTask);
router.put('/:subTaskId', isAuthenticated, SubTasks.updateSubTask);
router.delete('/:subTaskId', isAuthenticated, SubTasks.deleteSubTask);
router.get('/:subTaskId', isAuthenticated, SubTasks.getOneSubTask);
export default router;
