import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { logger } from './middlewares/logger.js';
import contactsRout from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = async () => {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/VideoEncoder.api+json'],
      limit: '100kb',
    }),
  );
  // const cors = require('cors');

  app.use(
    cors({
      origin: 'https://track-rental-auth-react-ts.vercel.app', // 👈 Додай URL фронтенду
      credentials: true, // Дозволяє передавати cookies та токени
      allowedHeaders: ['Content-Type', 'Authorization'], // Дозволені заголовки
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Дозволені методи
    }),
  );

  // app.use(cors());
  app.use(cookieParser());
  app.options('*', cors()); // Дозволяє всі preflight-запити

  app.use(logger);
  app.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hello User!' });
  });
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRout);

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
