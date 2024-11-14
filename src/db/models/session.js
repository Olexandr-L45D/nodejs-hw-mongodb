
import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const Session = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, },
    // Id юзера, якому належить сесія
    accessToken: { type: String, required: true },
    // accessToken - короткоживучий(в нашому випадку 15 хвилин) токен, який браузер буде нам додавати в хедери запитів (хедер Authorization)
    refreshToken: { type: String, required: true },
    // Refresh токену - більш довгоживучому (в нашому випадку 1 день) токену, який можна буде обміняти на окремому ендпоінті на нову пару access + resfresh токенів. Зберігається в cookies
    accessTokenValidUntil: { type: Date, required: true },
    // accessTokenValidUntil - Терміну життя access токену
    refreshTokenValidUntil: { type: Date, required: true },

},
    { versionKey: false, timestamps: true },
);
// використовую хуки на схемі сесії

Session.post("save", handleSaveError);

Session.pre("findOneAndUpdate", setUpdateSettings);

Session.post("findOneAndUpdate", handleSaveError);

export const SessionsCollection = model('sessions', Session);
