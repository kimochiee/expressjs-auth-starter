import ApiError from './ApiError.js';
import statusCode from '../config/status.js';

export default (requestUser, resoureUserid) => {
  if (
    requestUser.role === 'admin' ||
    requestUser._id.toString() === resoureUserid
  )
    return;

  throw new ApiError(
    statusCode.FORBIDDEN,
    'Not authorized to access this route'
  );
};
