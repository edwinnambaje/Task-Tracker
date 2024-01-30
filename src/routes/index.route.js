import express from 'express';
import users from './user.route';
import tasks from './task.route';
import subTask from './subTask.route';

const routes = express();

routes.use('/api/v1/users', users);
routes.use('/api/v1/tasks', tasks);
routes.use('/api/v1/subtask', subTask);

export default routes;
