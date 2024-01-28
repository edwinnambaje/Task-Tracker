import express from 'express';
import Users from '../controllers/user.controller';

const router = express.Router();
router.post('/register', Users.register);
router.post('/login', Users.login);
// router.get('/all', isAuthenticated, checkPlayer(), Admin.getAllUsers);
// router.get(
//   '/:id',
//   Admin.getOneUser
// );
export default router;
