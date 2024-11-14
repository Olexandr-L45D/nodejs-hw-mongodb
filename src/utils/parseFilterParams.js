
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











