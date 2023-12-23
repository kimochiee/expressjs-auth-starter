import express from 'express';
const router = express.Router();

import authValidation from '../../validations/auth.validation.js';
import authController from '../../controllers/auth.controller.js';

import auth from '../../../middlewares/auth.middleware.js';

router.post('/register', authValidation.register, authController.register);
router.post('/login', authValidation.login, authController.login);
router.get(
  '/logout',
  // authValidation.logout,
  auth.authenticateUser,
  authController.logout
);
router.post(
  '/verify-email',
  authValidation.verifyEmail,
  authController.verifyEmail
);
router.post(
  '/forgot-password',
  authValidation.forgotPassword,
  authController.forgotPassword
);
router.post(
  '/reset-password',
  authValidation.resetPassword,
  authController.resetPassword
);

export default router;
