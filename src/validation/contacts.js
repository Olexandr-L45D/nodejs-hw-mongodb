import Joi from 'joi';
import { typeList } from '../constants/contacts.js';
// Оголошення схеми з кастомізованими повідомленнями .messages()
export const createContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least {#limit} characters',
        'string.max': 'Username should have at most {#limit} characters',
        'any.required': 'Username is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.min': 'phoneNumber should have at least {#limit} characters',
        'string.max': 'phoneNumber should have at most {#limit} characters',
        'any.required': 'phoneNumber is required',
    }),
    email: Joi.string().email().min(3).max(20).required(),
    // .messages({
    // 'string.min': 'email should have at least {#limit} characters',
    // 'string.max': 'email should have at most {#limit} characters',
    // 'any.required': 'email is required',}),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...typeList).required(),

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
    email: Joi.string().email().min(3).max(20).messages({
        'string.min': 'email should have at least {#limit} characters',
        'string.max': 'email should have at most {#limit} characters',
        'any.required': 'email is required',
    }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...typeList),

});

// ?page=1&perPage=10&sortBy=phoneNumber&sortOrder=asc

