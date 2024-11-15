//
import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/ContactsCollection.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
// сервісні функції з коллекції на сервері роблять обробку різними методами по потребі(find, findById, create, findOneAndDelete, findOneAndUpdate)
export const getAllContacts = async (
    { page = 1, perPage = 4, sortOrder = SORT_ORDER.ASC, sortBy = '_id', filter = {}, }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find();

    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    };
    if (filter.isFavourite !== undefined) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    };
    if (filter.userId !== undefined) {
        contactsQuery.where('userId').equals(filter.userId);
    };

    const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments();
    const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
    const paginationData = calculatePaginationData(contactsCount, perPage, page);
    return {
        data: contacts,
        ...paginationData,
    };
};
// getAllContacts повертає - видає весь масив студентів згідно шаблону описаному в studentsSchema за рах методу find(), findById
export const createNewContact = payload => ContactsCollection.create(payload);

export const getContactsById = id => ContactsCollection.findById(id);

export const deletContactById = filter => ContactsCollection.findOneAndDelete(filter);
// Для видалення документа з колекції в Mongoose використовується метод:  findOneAndDelete(filter, options, callback)
export const updateContactById = async (contactId, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId }, payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        }
    );
    if (!rawResult || !rawResult.value) return null;
    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};



































// Model.findOneAndUpdate(query, update, options, callback)

// type - відображає тип контакту, значення властивості contactType
// isFavourite - відображає чи є контакт обраним
// if (filter.contactType) {
//     contactsQuery.where('contactType').equals(filter.contactType);
// }
// if (filter.isFavourite !== undefined) {
//     contactsQuery.where('isFavourite').equals(filter.isFavourite);
// }
