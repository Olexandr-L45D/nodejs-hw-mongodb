// ctrlWrapper.js - (типу загальний контроллер - controller) Щоб уникнути повторення коду, створимо допоміжну функцію-обгортку.
export const ctrlWrapper = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
