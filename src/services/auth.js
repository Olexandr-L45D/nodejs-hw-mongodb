import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import {
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THERTY_DAY,
} from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  getUsernameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';
// import { generateActivationToken } from '../utils/generateActivationToken.js';

const appDomain = env('FRONTEND_DOMAIN');
// const jwtSecret = env('JWT_SECRET');

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THERTY_DAY),
  };
};

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email already in use');

  const encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return newUser; // Повертаємо створеного юзера, щоб контролер міг з ним працювати
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');
  const ispasswordCompare = await bcrypt.compare(password, user.password);
  // Порівнюємо хеші паролів
  if (!ispasswordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }
  // Далі, функція видаляє попередню сесію користувача, якщо така існує, з колекції сесій. Це робиться для уникнення конфліктів з новою сесією.
  await SessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession();
  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
// Нарешті після перевірок функція loginUser створює нову сесію в базі даних. Нова сесія включає ідентифікатор користувача,// згенеровані токени доступу та оновлення: accessToken, refreshToken, а також часові межі їхньої дії.Токен доступу має обмежений термін дії(наприклад, 15 хвилин), тоді як токен для оновлення діє довше(наприклад, один день).
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
  });
};
// export const logoutUser = sessionId => SessionCollection.deleteOne({ _id: sessionId }), refreshUsersSession виконує процес оновлення сесії користувача і взаємодію з базою даних через асинхронні запити.
// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   const session = await SessionsCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });
//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   const isSessionTokenExpired =
//     new Date() > new Date(session.refreshTokenValidUntil);
//   if (isSessionTokenExpired) {
//     throw createHttpError(401, 'Session token expired');
//   }
//   await SessionsCollection.deleteOne({ _id: session._id });
//   // await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
//   const newSession = createSession();
//   return await SessionsCollection.create({
//     userId: session.userId,
//     ...newSession,
//   });
// };

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({ _id: session._id });

  const newSession = createSession();
  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  await UsersCollection.updateOne(
    { _id: user._id },
    { resetPasswordToken: resetToken },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${appDomain}/auth/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

// export const requestResetToken = async (email) => {
//   const user = await UsersCollection.findOne({ email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }
//   const resetToken = jwt.sign(
//     {
//       sub: user._id,
//       email,
//     },
//     env('JWT_SECRET'),
//     {
//       expiresIn: '5m',
//     },
//   );
//   const resetPasswordTemplatePath = path.join(
//     TEMPLATES_DIR,
//     'reset-password-email.html',
//   );
//   const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');
//   const template = handlebars.compile(templateSource);
//   // const token = jwt.sign({ email }, jwtSecret, { expiresIn: "24h" });

//   const html = template({
//     name: user.name,
//     link: `${appDomain}/auth/reset-password?token=${resetToken}`,
//     //     link: `${appDomain}/auth/verify?token=${token}`
//   });
//   await sendEmail({
//     from: env(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html,
//   });
// };

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
    resetPasswordToken: payload.token, // Переконуємось, що токен збігається
  });

  if (!user) throw createHttpError(404, 'User not found');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword, resetPasswordToken: null }, // Видаляємо токен після скидання
  );
};

export const verifyUser = async (token) => {
  try {
    const { email } = jwt.verify(token, env('JWT_SECRET'));

    const user = await UsersCollection.findOne({ email });
    if (!user) throw createHttpError(404, `${email} not found`);

    if (user.verify) throw createHttpError(400, 'User already verified');

    return await UsersCollection.findByIdAndUpdate(user._id, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

//  const confirmEmailTemplatePath = path.join(
//     TEMPLATES_DIR,
//     'confirm-email.html',
//   );

//   const templateSource = (
//     await fs.readFile(confirmEmailTemplatePath)
//   ).toString();

//   const template = handlebars.compile(templateSource);
//   const html = template({
//     link: `${env('FRONTEND_DOMAIN')}/confirm-email?token=${activateToken}`,
//   });

//   try {
//     await sendEmail({
//       from: env(SMTP.SMTP_FROM),
//       to: email,
//       subject: 'Confirm your email',
//       html,
//     });
//   } catch (error) {
//     throw createHttpError(500, error.message || 'Email sending failed');
//   }
//   return;
// };

export const confirmEmail = async (payload) => {
  const { token } = payload;

  if (!token) {
    throw createHttpError(400, 'Activation token required');
  }

  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));

    const user = await UsersCollection.findById({ _id: decoded.sub });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    if (user.isActive) {
      throw createHttpError(400, 'Account is already activated');
    }

    await UsersCollection.updateOne({ _id: user._id }, { isActive: true });
    await SessionsCollection.findOneAndDelete({ userId: user._id });

    const session = createSession();

    return SessionsCollection.create({ userId: user._id, ...session });
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }
};

/* GOOGLE OAUTH */
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getUsernameFromGoogleTokenPayload(payload),
      password,
      photo: payload.picture,
      isActive: true,
    });
  }

  const newSession = createSession();
  return await SessionsCollection.create({ userId: user._id, ...newSession });
};
