import catchAsync from '../../utils/catchAsync.js';
import statusCode from '../../config/status.js';
import attachCookies from '../../utils/attachCookies.js';

import userService from '../services/user.service.js';
import authService from '../services/auth.service.js';
import tokenService from '../services/token.service.js';
import emailService from '../services/email.service.js';

import crypto from 'crypto';

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await userService.createUser({
    name,
    email,
    password,
    verificationToken,
  });

  await emailService.sendVerificationEmail(
    user.name,
    user.email,
    user.verificationToken,
    req.get('x-forwarded-host')
  );

  res
    .status(statusCode.CREATED)
    .json({ msg: 'Success! Please check your email to verify account' });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.loginWithEmailAndPassword(email, password);
  const refreshToken = await tokenService.createToken(req, user);
  attachCookies(res, user, refreshToken);

  res.status(statusCode.OK).json({ user });
});

const logout = catchAsync(async (req, res, next) => {
  await authService.logout(res, req.user._id);

  res.status(statusCode.OK).json({ msg: 'User logged out' });
});

// const logout = catchAsync(async (req, res, next) => {
//   await authService.logout(res, req.user._id);

//   res.status(statusCode.OK).json({ msg: 'User logged out' });
// });

const verifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken, email } = req.body;

  await authService.verifyEmail(verificationToken, email);

  res.status(statusCode.OK).json({ msg: 'Email verified' });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const payload = await authService.forgotPassword(email);
  await emailService.sendResetPasswordToken(
    payload.user.name,
    email,
    payload.passwordToken,
    req.get('x-forwarded-host')
  );

  res
    .status(statusCode.OK)
    .json({ msg: 'Please check your email for reset password link' });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token, email, password } = req.body;

  await authService.resetPassword(token, email, password);

  res.status(statusCode.OK).json({ msg: 'Reset password successgully' });
});

const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
});

export default {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
