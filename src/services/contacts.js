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
