import createHttpError from "http-errors";
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, SMTP, TEMPLATES_DIR, THERTY_DAY } from "../constants/index.js";
import { SessionsCollection } from "../db/models/session.js";
import { UsersCollection } from "../db/models/user.js";
import { sendEmail } from "../utils/sendMail.js";
import { env } from "../utils/env.js";
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return {
        accessToken, refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THERTY_DAY),
        // accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
        // refreshTokenValidUntil: Date.now() + THERTY_DAY,
    };
};

export const registerUser = async (payload) => {
    const { email, password } = payload;
    const user = await UsersCollection.findOne({ email });
    if (user) throw createHttpError(409, "Email already in use");
    const encryptedPassword = await bcrypt.hash(password, 10);
    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async ({ email, password }) => {
    const user = await UsersCollection.findOne({ email });
    if (!user) throw createHttpError(401, "Email or password invalid");
    const ispasswordCompare = await bcrypt.compare(password, user.password);
    // Порівнюємо хеші паролів
    if (!ispasswordCompare) {
        throw createHttpError(401, "Email or password invalid");
    }
    // Далі, функція видаляє попередню сесію користувача, якщо така існує, з колекції сесій. Це робиться для уникнення конфліктів з новою сесією.
    await SessionsCollection.deleteOne({ userId: user._id });
    const newSession = createSession();
    // const accessToken = randomBytes(30).toString("base64");
    // const refreshToken = randomBytes(30).toString("base64");
    // return SessionsCollection.create({
    return await SessionsCollection.create({
        userId: user._id,
        ...newSession,
        // accessToken, refreshToken,
        // accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
        // refreshTokenValidUntil: Date.now() + THERTY_DAY,
    });
};

// Нарешті після перевірок функція loginUser створює нову сесію в базі даних. Нова сесія включає ідентифікатор користувача,
// згенеровані токени доступу та оновлення: accessToken, refreshToken, а також часові межі їхньої дії.Токен доступу має обмежений термін дії(наприклад, 15 хвилин), тоді як токен для оновлення діє довше(наприклад, один день).
export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({
        _id: sessionId
    });
};
// export const logoutUser = sessionId => SessionCollection.deleteOne({ _id: sessionId });
// refreshUsersSession виконує процес оновлення сесії користувача і взаємодію з базою даних через асинхронні запити.
export const refreshUsersSession = async ({
    sessionId, refreshToken
}) => {
    const session = await SessionsCollection.findOne(
        {
            _id: sessionId,
            refreshToken,
        });
    if (!session) {
        throw createHttpError(401, 'Session not found');
    };

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }
    await SessionsCollection.deleteOne({ _id: session._id });
    // await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
    const newSession = createSession();
    return await SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });
};

export const requestResetToken = async (email) => {
    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        env('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );
    const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
    const templateSource = ((await fs.readFile(resetPasswordTemplatePath)).toString());
    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-password? token=${resetToken}`
    });
    await sendEmail({
        from: env(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
};

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
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UsersCollection.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
    );
};


// SMTP_PASSWORD = xsmtpsib - 2b237ed81d4253bd91cf66cb162760c211eefba83bb6f53d253def9a86bd9a28 - PTgWr5tHJvAfVRSc


