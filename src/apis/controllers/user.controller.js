import catchAsync from '../../utils/catchAsync.js';
import statusCode from '../../config/status.js';
import checkPermission from '../../utils/checkPermission.js';

import userService from '../services/user.service.js';

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.queryUsers(req.query);

  res.status(statusCode.OK).json({ users });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);

  checkPermission(req.user, req.params.userId);

  res.status(statusCode.OK).json({ user });
});

const getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.user._id);

  res.status(statusCode.OK).json({ user });
});

const createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);

  res.status(statusCode.CREATED).json({ user });
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(statusCode.OK).json({ user });
});

const updateUserPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  await userService.updateUserPassword(req.user._id, oldPassword, newPassword);

  res.status(statusCode.OK).json();
});

const deleteUser = catchAsync(async (req, res, next) => {
  await userService.deleteUserById(req.params.userId);

  res.status(statusCode.OK).json();
});

export default {
  getAllUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
