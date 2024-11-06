
const parseType = (contactType) => {
    const isString = typeof contactType === 'string';
    if (!isString) return;
    const isTypeSpecific = (contactType) => ['work', 'home', 'personal'].includes(contactType);
    if (isTypeSpecific(contactType)) return contactType;
};
const parseFavorit = (isFavourite) => {
    const isBoolean = typeof isFavourite === 'boolean';
    if (isBoolean) return;
    const isFavorits = (isFavourite) => ['true', 'false'];
    return isFavorits;
};
export const parsFilterParams = (query) => {
    const { contactType, isFavourite } = query;
    const parsedsTyps = parseType(contactType);
    const parsedsFavorits = parseFavorit(isFavourite);
    return {
        contactType: parsedsTyps,
        isFavourite: parsedsFavorits,
    };
};
