/* eslint-disable no-console */
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/mongodb.js';
import env from './config/env.js';

import APIs_V1 from './apis/routes/v1/index.js';
import errorMiddleware from './middlewares/error.middleware.js';

const start = () => {
  const app = express();
  const port = env.port;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());
  app.options('*', cors());

  app.use('/api/v1', APIs_V1);

  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

(async () => {
  try {
    await connectDB();

    start();
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
})();
