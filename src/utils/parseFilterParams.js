
const parseType = (type) => {
    const isString = typeof type === 'string';
    if (!isString) return;
    const isTypeSpecific = (type) => ['work', 'home', 'personal'].includes(type);
    if (isTypeSpecific(type)) return type;
};

const parseFavorit = (boolean) => {
    const isString = typeof boolean === 'string';
    if (!isString) return;

    const isFavourite = boolean.toLowerCase();

    return isFavourite;
};
export const parsFilterParams = (query) => {
    const { contactType, isFavourite } = query;
    const parsedsTyps = parseType(contactType);
    const parsedsFavorits = parseFavorit(isFavourite);
    return {
        type: parsedsTyps,
        isFavourite: parsedsFavorits,
    };
};

// src/utils/parseFilterParams.js
// приклад парсингу для boolean, number та для string значення
// const parseGender = (gender) => {
//     const isString = typeof gender === 'string';
//     if (!isString) return;
//     const isGender = (gender) => ['male', 'female', 'other'].includes(gender);

//     if (isGender(gender)) return gender;
// };

// const parseNumber = (number) => {
//     const isString = typeof number === 'string';
//     if (!isString) return;

//     const parsedNumber = parseInt(number);
//     if (Number.isNaN(parsedNumber)) {
//         return;
//     }

//     return parsedNumber;
// };
// const parseIsFavourite = (boolean) => {
//     const isString = typeof boolean === 'string';
//     if (!isString) return;

//     const isFavourite = boolean.toLowerCase();

//     return isFavourite;
// };

// export const parseFilterParams = (query) => {
//     const { contactType, isFavourite } = query;

//     const parsedType = parseContactType(contactType);
//     const parsedIsFavourite = parseIsFavourite(isFavourite);

//     return {
//         type: parsedType,
//         isFavourite: parsedIsFavourite,
//     };
// };
