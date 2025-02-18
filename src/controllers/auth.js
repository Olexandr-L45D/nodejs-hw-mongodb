import { THERTY_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
  verifyUser,
  createSession,
} from '../services/auth.js';

// export const registerUserController = async (req, res) => {
//     const user = await registerUser(req.body);
//     res.status(201).json({
//         status: 201,
//         message: 'Successfully registered a user!',
//         data: user,
//     });
// };
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  // Видаляємо стару сесію, якщо така є
  await SessionsCollection.deleteOne({ userId: user._id });

  // Створюємо нову сесію з токенами
  const newSession = createSession();
  const session = await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });

  // Встановлюємо HTTP-only кукі
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THERTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THERTY_DAY),
  });

  // Відправляємо відповідь з accessToken
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// loginUserController виконує процес обробки запиту на вхід користувача і взаємодію з клієнтом через HTTP
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THERTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THERTY_DAY),
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

// const setupSession = (res, session) => {
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + THERTY_DAY),
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + THERTY_DAY),
//   });
// };

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THERTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THERTY_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// export const refreshUserSessionController = async (req, res) => {
//   const session = await refreshUsersSession({
//     sessionId: req.cookies.sessionId,
//     refreshToken: req.cookies.refreshToken,
//   });

//   setupSession(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await verifyUser(token);

  res.json({
    status: 200,
    message: 'User verify successfully',
  });
};
