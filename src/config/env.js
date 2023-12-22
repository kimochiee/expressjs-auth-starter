import 'dotenv/config';

export default {
  port: process.env.PORT || 8080,
  mongo_uri: process.env.MONGO_URI,
  build_mode: process.env.BUILD_MODE,
  jwt_secret: process.env.JWT_SECRET,
  jwt_access_expired: process.env.JWT_ACCESS_EXPIRED,
  jwt_access_cookie_expired: process.env.JWT_ACCESS_COOKIE_EXPIRED,
  jwt_refresh_expired: process.env.JWT_REFRESH_EXPIRED,
  jwt_refresh_cookie_expired: process.env.JWT_REFRESH_COOKIE_EXPIRED,
  email: {
    smtp: {
      host: process.env.SENDGRID_HOST,
      port: process.env.SENDGRID_PORT,
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
};
