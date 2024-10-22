// logic
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

import { getAllStudents, getStudentById } from './services/students.js';



// const app = express();
// const PORT = 3000;
// dotenv.config();
// Для доступу до змінних оточення в середовищі Node.js використовується глобальний об'єкт process.env, який доступний у коді будь-якого модуля (так само як window або document доступні у браузері).
// const PORT = Number(process.env.PORT);
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

    app.get('/', (req, res) => {
        res.json({
            message: 'Hello Alex!'
        });
    });
    // app.use('*', (req, res, next) => {
    //     res.status(404).json({
    //         message: 'Not found',
    //     });
    //     // next();
    // });
    app.get('/students', async (req, res) => {
        const students = await getAllStudents();

        res.status(200).json({
            data: students,
        });
    });

    app.get('/students/:studentId', async (req, res, next) => {
        const { studentId } = req.params;
        const student = await getStudentById(studentId);

        // Відповідь, якщо контакт не знайдено
        if (!student) {
            res.status(404).json({
                message: 'Student not found'
            });
            return;
        }

        // Відповідь, якщо контакт знайдено
        res.status(200).json({
            data: student,
        });
        next();
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
        // next();
    });
    app.use((err, req, res, next) => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message,
        });
        next();
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// http://localhost:3000/students - ми отримаємо масив усіх студентів
// http://localhost:3000/students/:studentId
