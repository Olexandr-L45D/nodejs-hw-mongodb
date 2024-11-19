
// parseSortOrder = (sortOrder) - парсинг методу сортування (зростання чи спадання)
// parseSortBy = (sortBy) - парсинг за значенням (імя чи інший параметр)
import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
    if (isKnownOrder) return sortOrder;
    return SORT_ORDER.ASC;
};
const parseSortBy = (sortBy) => {
    const keysOfContact = [
        '_id',
        'name',
        'phoneNumber',
        'email',
        'createdAt',
        'updatedAt',
    ];
    if (keysOfContact.includes(sortBy)) {
        return sortBy;
    }
    return '_id';
};
export const parseSortParams = (query) => {
    const { sortOrder, sortBy } = query;
    const parsedSortOrder = parseSortOrder(sortOrder);
    const parsedSortBy = parseSortBy(sortBy);
    return {
        sortOrder: parsedSortOrder,
        sortBy: parsedSortBy,
    };
};

// Загальна функція parseSortParams, яка експортується з модуля, інтегрує обидві ці функції. Вона приймає об'єкт query, з якого витягує значення sortOrder та sortBy, передає їх на обробку у відповідні функції та повертає об'єкт із валідованими та готовими до використання параметрами для сортування.
