import express from 'express';
const router = express.Router();

import userValidation from '../../validations/user.validation.js';
import userController from '../../controllers/user.controller.js';

import auth from '../../../middlewares/auth.middleware.js';

router.use(auth.authenticateUser);

router
  .route('/')
  .get(
    auth.authorizeUser('admin'),
    userValidation.getAllUsers,
    userController.getAllUsers
  )
  .post(userValidation.createUser, userController.createUser);

router.route('/showMe').get(userController.getCurrentUser);
router
  .route('/updateMyPassword')
  .patch(userValidation.updateUserPassword, userController.updateUserPassword);

router
  .route('/:userId')
  .get(userValidation.getUser, userController.getUser)
  .patch(userValidation.updateUser, userController.updateUser)
  .delete(userValidation.deleteUser, userController.deleteUser);

export default router;
