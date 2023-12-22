import User from '../models/user.model.js';
import ApiError from '../../utils/ApiError.js';
import ApiFeatures from '../../utils/ApiFeatures.js';
import statusCode from '../../config/status.js';

const createUser = async (data) => {
  if (await User.isEmailTaken(data.email)) {
    throw new ApiError(statusCode.BAD_REQUEST, 'Email already taken');
  }

  return await User.create(data);
};

const queryUsers = async (query) => {
  const features = new ApiFeatures(User.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(statusCode.NOT_FOUND, 'User not found');
  }

  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(statusCode.NOT_FOUND, 'User not found');
  }

  return user;
};

const getUserWithConditions = async (conditions) => {
  return await User.findOne(conditions);
};

const updateUserById = async (id, data) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(statusCode.NOT_FOUND, 'User not found');
  }

  if (data.email && (await user.isEmailTaken(data.email, id))) {
    throw new ApiError(statusCode.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, data);
  await user.save();

  return user;
};

const updateUserPassword = async (id, oldPassword, newPassword) => {
  const user = await User.findById(id);

  if (oldPassword == newPassword) {
    throw new ApiError(statusCode.BAD_REQUEST, 'Password must not the same');
  }

  if (!(await user.comparePassword(oldPassword))) {
    throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect password');
  }

  user.password = newPassword;
  await user.save();
};

const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(statusCode.NOT_FOUND, 'User not found');
  }
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserWithConditions,
  updateUserById,
  updateUserPassword,
  deleteUserById,
};
