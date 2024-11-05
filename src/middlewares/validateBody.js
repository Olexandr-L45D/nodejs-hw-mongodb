// Створіть функцію validateBody, яка буде приймати аргументом схему валідації, а повертати буде middleware для валідації body запиту.

import createHttpError from "http-errors";
export const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        const error = createHttpError(400, 'Bad Request', { errors: err.details });
        next(error);
    }
};
