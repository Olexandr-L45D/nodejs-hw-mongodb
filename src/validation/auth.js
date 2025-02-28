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

export const confirmEmailSchema = Joi.object({
  token: Joi.string().required(),
});

// signin
export const authLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
});

// OAuth
export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
