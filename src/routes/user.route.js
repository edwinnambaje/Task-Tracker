import express from 'express';
import Users from '../controllers/user.controller';
import isAuthenticated from '../helpers/verifyToken';

const router = express.Router();
router.post('/register', Users.register);
router.post('/login', Users.login);
router.get('/all', isAuthenticated, Users.getAllUsers);
router.get(
  '/:id',
  isAuthenticated,
  Users.getOneUser
);
export default router;
