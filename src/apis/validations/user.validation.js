import Joi from 'joi';
import catchAsync from '../../utils/catchAsync.js';

import rule from '../../utils/validators.js';

const getAllUsers = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    email: Joi.string(),
    name: Joi.string(),
    role: Joi.string(),
    page: Joi.number().integer(),
    sort: Joi.string(),
    limit: Joi.number().integer(),
    fields: Joi.string(),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.query);
  next();
});

const getUser = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    userId: Joi.string()
      .pattern(rule.objectIdRule)
      .message(rule.objectIdRuleMessage),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.params);
  next();
});

const createUser = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().trim().min(8).alphanum(),
    name: Joi.string().required().trim().min(3).max(50),
    role: Joi.string().required().valid('user', 'admin'),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.body);
  next();
});

const updateUser = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    userId: Joi.string()
      .pattern(rule.objectIdRule)
      .message(rule.objectIdRuleMessage),
    email: Joi.string().email().trim().lowercase(),
    name: Joi.string().trim().min(3).max(50),
  }).options({ abortEarly: false });

  Object.assign(req.body, req.params);

  await validate.validateAsync(req.body);
  next();
});

const updateUserPassword = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    oldPassword: Joi.string().required().trim().min(8).alphanum(),
    newPassword: Joi.string().required().trim().min(8).alphanum(),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.body);
  next();
});

const deleteUser = catchAsync(async (req, res, next) => {
  const validate = Joi.object({
    userId: Joi.string()
      .pattern(rule.objectIdRule)
      .message(rule.objectIdRuleMessage),
  }).options({ abortEarly: false });

  await validate.validateAsync(req.params);
  next();
});

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
