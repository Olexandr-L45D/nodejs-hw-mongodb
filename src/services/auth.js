import createHttpError from "http-errors";
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { SessionCollection } from "../db/models/session.js";
import { UsersCollection } from "../db/models/user.js";


export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({
        email: payload.email
    });
    if (user) throw createHttpError(409, "Email in use");
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({
        email: payload.email,
    });
    if (!user) throw createHttpError(404, 'User not found!');
    const isEqual = await bcrypt.compare(payload.password, user.password);
    // Порівнюємо хеші паролів
    if (!isEqual) {
        throw createHttpError(401, 'Unautorized');
    }
    await SessionCollection.deleteOne({ userId: user._id });
    // Далі, функція видаляє попередню сесію користувача, якщо така існує, з колекції сесій. Це робиться для уникнення конфліктів з новою сесією.
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return await SessionCollection.create({
        userId: user._id, accessToken, refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

// Нарешті, функція створює нову сесію в базі даних. Нова сесія включає ідентифікатор користувача,
// згенеровані токени доступу та оновлення: accessToken, refreshToken, а також часові межі їхньої дії.Токен доступу має обмежений термін дії(наприклад, 15 хвилин), тоді як токен для оновлення діє довше(наприклад, один день).
export const logoutUser = async (sessionId) => {
    await SessionCollection.deleteOne({
        _id: sessionId
    });
};
const createSession = () => {
    const accessToken = randomBytes(30).toString('base46');
    const refreshToken = randomBytes(30).toString('base64');
    return {
        accessToken, refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};
// refreshUsersSession виконує процес оновлення сесії користувача і взаємодію з базою даних через асинхронні запити.
export const refreshUsersSession = async ({
    sessionId, refreshToken
}) => {
    const session = await SessionCollection.findOne(
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
    const newSession = createSession();
    await SessionCollection.deleteOne({
        _id: sessionId, refreshToken
    });
    return await SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
};
