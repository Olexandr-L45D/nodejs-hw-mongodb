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

  app.use((req, res, next) => {
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  // ✅ Додаємо CORS перед `cookieParser`
  app.use(
    cors({
      origin: [
        'https://track-rental-auth-react-ts.vercel.app',
        'http://localhost:5173',
      ],
      credentials: true, // Дозволяє передавати cookies та токени
      allowedHeaders: ['Content-Type', 'Authorization'], // Дозволені заголовки
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Дозволені методи
    }),
  );

  app.use(cookieParser()); // ✅ `cookieParser()` після `cors()`

  // ✅ Preflight запити теж з `credentials: true`
  app.options(
    '*',
    cors({
      origin: [
        'https://track-rental-auth-react-ts.vercel.app',
        'http://localhost:5173',
      ],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  app.use(
    express.json({
      type: ['application/json', 'application/VideoEncoder.api+json'],
      limit: '100kb',
    }),
  );

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
