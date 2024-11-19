
// Функція parseNumber призначена для перетворення рядкових значень в числа і є особливо корисною в контекстах, де ми не можемо бути впевнені у типі даних, що надходять. Вона приймає два параметри: number, що є значенням для перетворення, та defaultValue, яке використовується як запасне, якщо перетворення неможливе.
const parseNumber = (number, defaultValue) => {
    const isString = typeof number === 'string';
    if (!isString) return defaultValue;

    const parsedisNumber = parseInt(number);
    if (Number.isNaN(parsedisNumber)) {
        return defaultValue;
    }
    return parsedisNumber;
};

export const parsePaginationParams = (query) => {
    const { page, perPage } = query;
    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);
    return {
        page: parsedPage,
        perPage: parsedPerPage,
    };
};
