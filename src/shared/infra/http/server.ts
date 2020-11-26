import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import uploadConfig from '@config/upload';
import routes from './routes';

import AppError from '../errors/AppError';

import '../typeorm';
import '../../container';

const app = express();

app.use(cors());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(express.json());
app.use(routes);

app.use(errors());
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      console.log(error);
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server is running on port 3333');
});
