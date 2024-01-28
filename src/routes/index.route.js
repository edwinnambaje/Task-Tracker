import express from 'express';
import users from './user.route';
import tasks from './task.route';

const routes = express();

routes.use('/api/v1/users', users);
routes.use('/api/v1/tasks', tasks);

export default routes;
