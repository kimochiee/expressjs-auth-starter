import ApiError from '../../utils/ApiError.js';
import statusCode from '../../config/status.js';
import hash from '../../utils/hash.js';

import userService from './user.service.js';
import tokenService from './token.service.js';

import env from '../../config/env.js';

import crypto from 'crypto';

const loginWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!(await user.comparePassword(password))) {
    throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect email or password');
  }

  if (!user.isVerified) {
    throw new ApiError(statusCode.UNAUTHORIZED, 'Please verify your email');
  }

  return user;
};

const logout = async (res, userId) => {
  await tokenService.deleteTokenByUserId(userId);

  res
    .clearCookie('accessToken', {
      httpOnly: true,
      secure: env.build_mode === 'prod' ? true : false,
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.build_mode === 'prod' ? true : false,
    });
};

const verifyEmail = async (verificationToken, email) => {
  const user = await userService.getUserByEmail(email);

  if (user.isVerified) {
    return;
  }

  if (user.verificationToken !== verificationToken) {
    throw new ApiError(statusCode.UNAUTHORIZED, 'Email verification failed');
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';

  await user.save();
};

const attachCookies = (res, user, refreshToken) => {
  const accessTokenJWT = tokenService.generateAccessToken(user);
  const refreshTokenJWT = tokenService.generateRefreshToken(user, refreshToken);

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    maxAge: env.jwt_access_cookie_expired * 60 * 1000,
    secure: env.build_mode === 'prod' ? true : false,
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    maxAge: env.jwt_refresh_cookie_expired * 24 * 60 * 60 * 1000,
    secure: env.build_mode === 'prod' ? true : false,
  });
};

const forgotPassword = async (email) => {
  const user = await userService.getUserByEmail(email);

  const passwordToken = crypto.randomBytes(40).toString('hex');
  const passwordTokenExpirationDate = new Date(Date.now() + 10 * 60 * 1000);

  user.passwordToken = hash(passwordToken);
  user.passwordTokenExpirationDate = passwordTokenExpirationDate;
  await user.save();

  return { user, passwordToken };
};

const resetPassword = async (token, email, password) => {
  const user = await userService.getUserByEmail(email);

  const currentDate = new Date();

  if (
    user.passwordToken === hash(token) &&
    user.passwordTokenExpirationDate > currentDate
  ) {
    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();
  }
};

export default {
  loginWithEmailAndPassword,
  logout,
  verifyEmail,
  attachCookies,
  forgotPassword,
  resetPassword,
};
