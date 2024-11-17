import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
    host: env(SMTP.SMTP_HOST),
    port: Number(env(SMTP.SMTP_PORT)),
    auth: {
        user: env(SMTP.SMTP_USER),
        pass: env(SMTP.SMTP_PASSWORD),
    },
});

export const sendEmail = async (options) => {
    return await transporter.sendMail(options);
};


// "name": "Olena Li",
//     "phoneNumber": "11122235",
//         "email": "Olena1_Li@gmail.com",
//             "isFavourite": false,
//                 "contactType": "personal",
// 6738c6ef4fc762147c2ab4a0
