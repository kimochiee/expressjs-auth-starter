import Token from '../models/token.model.js';
import ApiError from '../../utils/ApiError.js';
import statusCode from '../../config/status.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import authService from './auth.service.js';

import env from '../../config/env.js';

const generateAccessToken = (user) => {
  return jwt.sign({ user }, env.jwt_secret, {
    expiresIn: env.jwt_access_expired,
  });
};

const generateRefreshToken = (user, refreshToken) => {
  return jwt.sign({ user, refreshToken }, env.jwt_secret, {
    expiresIn: env.jwt_refresh_expired,
  });
};

const verifyJwtToken = (token) => {
  return jwt.verify(token, env.jwt_secret);
};

const createToken = async (req, res, user) => {
  const existingToken = await findTokenByUserId(user._id);
  let refreshToken = '';

  if (existingToken) {
    if (!existingToken.isValid) {
      throw new ApiError(statusCode.UNAUTHORIZED, 'Invalid credentials');
    }
    refreshToken = existingToken.refreshToken;
    authService.attachCookies(res, user, refreshToken);
  } else {
    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, userAgent, ip, user: user._id };

    authService.attachCookies(res, user, refreshToken);
    await Token.create(userToken);
  }
};

const findTokenByUserId = async (userId) => {
  return await Token.findOne({ user: userId });
};

const findTokenByUserIdAndRefreshToken = async (userId, refreshToken) => {
  const token = await Token.findOne({ user: userId, refreshToken });

  if (!token || !token?.isValid) {
    throw new ApiError(statusCode.UNAUTHORIZED, 'Authentication invalid');
  }

  return token;
};

const deleteTokenByUserId = async (userId) => {
  await Token.findOneAndDelete({ user: userId });
};

export default {
  generateAccessToken,
  generateRefreshToken,
  createToken,
  verifyJwtToken,

  findTokenByUserId,
  findTokenByUserIdAndRefreshToken,
  deleteTokenByUserId,
};
