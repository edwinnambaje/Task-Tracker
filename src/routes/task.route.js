import express from 'express';
import Tasks from '../controllers/task.controller';
import isAuthenticated from '../helpers/verifyToken';

const router = express.Router();
router.post('/create',isAuthenticated, Tasks.createTask);
router.get('/mine',isAuthenticated, Tasks.getAllTasksByUser);
router.put('/complete/:taskId',isAuthenticated, Tasks.completeTask);
router.put('/:taskId', isAuthenticated, Tasks.updateTask);
router.delete('/:taskId', isAuthenticated, Tasks.deleteTask);
router.get('/:taskId', isAuthenticated, Tasks.getOneTask);
export default router;
