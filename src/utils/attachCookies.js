import tokenService from '../apis/services/token.service.js';
import env from '../config/env.js';

export default (res, user, refreshToken) => {
  const accessTokenJWT = tokenService.generateAccessToken(user);
  const refreshTokenJWT = tokenService.generateRefreshToken(user, refreshToken);

  // res.cookie('accessToken', accessTokenJWT, {
  //   httpOnly: true,
  //   maxAge: env.jwt_access_cookie_expired * 60 * 1000,
  //   secure: env.build_mode === 'prod' ? true : false,
  // });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    maxAge: env.jwt_refresh_cookie_expired * 24 * 60 * 60 * 1000,
    secure: env.build_mode === 'prod' ? true : false,
  });

  return { accessTokenJWT, refreshTokenJWT };
};
