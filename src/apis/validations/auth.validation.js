import Joi from 'joi';
import catchAsync from '../../utils/catchAsync.js';

const register = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().trim().min(8).alphanum(),
    name: Joi.string().required().trim().min(3).max(50),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.body);
  next();
});

const login = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().trim(),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.body);
  next();
});

const logout = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    // accessToken: Joi.string().required().trim(),
    refreshToken: Joi.string().required().trim(),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.cookies);
  next();
});

const refreshToken = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    refreshToken: Joi.string().required().trim(),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.cookies);
  next();
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    verificationToken: Joi.string().required().trim(),
    email: Joi.string().required().email().trim().lowercase(),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.body);
  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
  });

  await validate.validateAsync(req.body);
  next();
});

const resetPassword = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().trim().min(8).alphanum(),
    token: Joi.string().required().trim(),
  });

  await validate.validateAsync(req.body);
  next();
});

export default {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
