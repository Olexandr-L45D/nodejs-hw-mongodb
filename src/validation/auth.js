import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least {#limit} characters',
    }),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


export const requestResetEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
});



//  значення які вставив в файл оточення (env) для перевірки так як мої були не авторизовані
// SMTP_HOST = smtp - relay.brevo.com
// SMTP_PORT = 587
// SMTP_USER = 765fb3001@smtp-brevo.com
// SMTP_PASSWORD = xsmtpsib-f533f9d1eab7ec239c37eaa378366307ac9ba7c13c08c93f0a608c40d176d64d-sKxkNGfz7BHpvEbA
// SMTP_FROM = vladislavapelhants@gmail.com


// "name": "Vladislav",
//     "email": "vladislavapelhants@gmail.com",
//         "password": "123Vlad"

// SMTP_HOST = smtp - relay.brevo.com
// SMTP_PORT = 587
// SMTP_USER = 801450002@smtp-brevo.com
// SMTP_PASSWORD = xsmtpsib-2b237ed81d4253bd91cf66cb162760c211eefba83bb6f53d253def9a86bd9a28-PTgWr5tHJvAfVRSc
// SMTP_FROM = litvinenko1978aleks@gmail.com
