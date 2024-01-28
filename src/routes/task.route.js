import express from 'express';
import Tasks from '../controllers/task.controller';
import isAuthenticated from '../helpers/verifyToken';

const router = express.Router();
router.post('/create',isAuthenticated, Tasks.createTask);
router.get('/mine',isAuthenticated, Tasks.getAllTasksByUser);
export default router;
