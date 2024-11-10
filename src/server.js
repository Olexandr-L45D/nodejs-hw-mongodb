// logic in setupServer
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import contactsRout from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = async () => {
    const app = express();
    // Завдяки цій мідлварі Express буде автоматично парсити тіло запиту і поміщати його в req.body, але тільки, якщо тип контенту встановлений як application / json за допомогою хедеру Content - Type.
    app.use(express.json({
        type: ['application/json', 'application/VideoEncoder.api+json'],
        limit: '100kb' // другий не обовьязковий аргумент для запиту що встановлює обмеження-ліміт
    }));
    app.use(cors());
    app.use(cookieParser());
    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            }
        })
    );
    app.get('/', async (req, res) => {
        res.status(200).json({
            message: "Hello User!",

        });
    });
    app.use(authenticate);
    app.use("/contacts", contactsRout, authRouter); // Додаємо роутер з запитами на: (get, post, put, patch, delete)
    app.use(notFoundHandler); // Додаємо notFoundHandler до app як middleware
    app.use(errorHandler); // Додаємо errorHandler до app як middleware
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// hw4-validation для монгодб
