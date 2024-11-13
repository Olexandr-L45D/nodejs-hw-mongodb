// logic in setupServer
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { logger } from "./middlewares/logger.js";
import contactsRout from './routers/contacts.js';
import authRouter from './routers/auth.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = async () => {
    const app = express();
    // Завдяки цій мідлварі Express буде автоматично парсити тіло запиту і поміщати його в req.body, але тільки, якщо тип контенту встановлений як application / json за допомогою хедеру Content - Type.
    app.use(express.json({
        type: ['application/json', 'application/VideoEncoder.api+json'],
        limit: '100kb'
    }));
    app.use(cors());
    app.use(cookieParser());
    app.use(logger);
    app.get('/', async (req, res) => { res.status(200).json({ message: "Hello User!", }); });
    app.use("/auth", authRouter);
    app.use("/contacts", contactsRout); // Додаємо роутер з запитами на: (get, post, put, patch, delete )
    app.use(notFoundHandler);
    app.use(errorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};


