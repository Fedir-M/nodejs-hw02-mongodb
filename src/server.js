import express from 'express';
import logger from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/motFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    logger({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }),
  );

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
