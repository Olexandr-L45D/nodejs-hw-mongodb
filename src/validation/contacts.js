import Joi from 'joi';
import { typeList } from '../constants/contacts.js';
import { emailRegexp } from '../constants/user.js';
// Оголошення схеми з кастомізованими повідомленнями .messages()
// export const createContactsSchema = Joi.object({
//     name: Joi.string().min(3).max(20).required().messages({
//         'string.base': 'Username should be a string',
//         'string.min': 'Username should have at least {#limit} characters',
//         'string.max': 'Username should have at most {#limit} characters',
//         'any.required': 'Username is required',
//     }),
//     phoneNumber: Joi.string().min(3).max(20).required().messages({
//         'string.min': 'phoneNumber should have at least {#limit} characters',
//         'string.max': 'phoneNumber should have at most {#limit} characters',
//         'any.required': 'phoneNumber is required',
//     }),
//     email: Joi.string().pattern(emailRegexp).required(),
//     isFavourite: Joi.boolean(),
//     contactType: Joi.string().valid(...typeList).required(),

// });

export const createContactsSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList).required(),

});

export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        'string.base': 'Username should be a string', // Кастомізація повідомлення для типу "string"
        'string.min': 'Username should have at least {#limit} characters',
        'string.max': 'Username should have at most {#limit} characters',
        'any.required': 'Username is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).messages({
        'string.min': 'phoneNumber should have at least {#limit} characters',
        'string.max': 'phoneNumber should have at most {#limit} characters',
        'any.required': 'phoneNumber is required',
    }),
    email: Joi.string().pattern(emailRegexp),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...typeList),

});

// ?page=1&perPage=10&sortBy=phoneNumber&sortOrder=asc

