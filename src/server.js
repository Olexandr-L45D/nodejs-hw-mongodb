// logic
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

import { getAllContacts, getContactsById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = async () => {
    const app = express();
    app.use(express.json());
    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            }
        })
    );
    app.use(cors());

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            message: "Successfully found contacts!",
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res, next) => {
        const { contactId } = req.params;
        const contact = await getContactsById(contactId);
        // Відповідь, якщо контакт не знайдено
        if (!contact) {
            res.status(404).json({
                message: 'Contact not found'
            });
            return;
        }
        // Відповідь, якщо контакт знайдено
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
        next();
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// http://localhost:3000/contacts - ми отримаємо масив усіх студентів
// http://localhost:3000/contacts/:contactId
