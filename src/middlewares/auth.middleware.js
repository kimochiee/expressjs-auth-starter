import ApiError from '../utils/ApiError.js';
import statusCode from '../config/status.js';
import attachCookies from '../utils/attachCookies.js';

import tokenService from '../apis/services/token.service.js';

const authenticateUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      const payload = tokenService.verifyJwtToken(accessToken);
      req.user = payload.user;
      return next();
    } else {
      const payload = tokenService.verifyJwtToken(refreshToken);
      const existingToken = await tokenService.findTokenByUserIdAndRefreshToken(
        payload.user._id,
        payload.refreshToken
      );

      attachCookies(res, payload.user, existingToken.refreshToken);

      req.user = payload.user;
      return next();
    }
  } catch (error) {
    return next(
      new ApiError(statusCode.UNAUTHORIZED, 'Authentication invalid')
    );
  }
};

// const auth = async (req, res, next) => {
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       const accessToken = req.headers.authorization.split(' ')[1];
//       const payload = tokenService.verifyJwtToken(accessToken);
//       req.user = payload.user;
//       return next();
//     } catch (error) {
//       throw new ApiError(statusCode.UNAUTHORIZED, 'Authentication invalid');
//     }
//   } else {
//     return res
//       .status(statusCode.FORBIDDEN)
//       .json({ nsg: 'No access token provided' });
//   }
// };

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      throw new ApiError(
        statusCode.FORBIDDEN,
        'You do not have permission to access this route'
      );
    }

    next();
  };
};

export default { authenticateUser, authorizeUser };
