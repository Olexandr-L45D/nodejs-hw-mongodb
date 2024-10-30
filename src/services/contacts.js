//
import { ContactsCollection } from '../db/ContactsCollection.js';

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};
// getAllContacts повертає - видає весь масив студентів згідно шаблону описаному в studentsSchema за рах методу find()
export const getContactsById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};
// getContactsById знаходить обєкт одного студента по айді за рах мет findById
export const createNewContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};
//  в Mongoose використовується метод:  Model.create(doc) = create(payload)
// doc — перший аргумент (обов’язковий), який містить дані (об'єкт або масив об'єктів)
// deletContactById - delet 1 contact By Id!
export const deletContactById = async (contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
    return contact;
};
// Для видалення документа з колекції в Mongoose використовується метод:
//  findOneAndDelete(filter, options, callback)
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
        isNew:
            Boolean(rawResult?.lastErrorObject?.upserted),
    };
};
// Model.findOneAndUpdate(query, update, options, callback)

