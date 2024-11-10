
import { model, Schema } from 'mongoose';

const Session = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    // Id юзера, якому належить сесія
    accessToken: { type: String, required: true },
    // accessToken - короткоживучий(в нашому випадку 15 хвилин) токен, який браузер буде нам додавати в хедери запитів (хедер Authorization)
    refreshToken: { type: String, required: true },
    // Refresh токену - більш довгоживучому (в нашому випадку 1 день) токену, який можна буде обміняти на окремому ендпоінті на нову пару access + resfresh токенів. Зберігається в cookies
    accessTokenValidUntil: { type: Date, required: true },
    // accessTokenValidUntil - Терміну життя access токену
    refreshTokenValidUntil: { type: Date, required: true },

},
    { timestamps: true, versionKey: false },
);
export const SessionCollection = model('sessions', Session);
