import {
    getAllContacts, getContactsById,
    createNewContact, deletContactById, updateContactById
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const contactAllControl = async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: 'Successfully found contacts',
        data: contacts
    });
};

export const deleteContactControl = async (req, res, next) => {
    const { contactId } = req.params;
    const deletcontact = await deletContactById(contactId);
    if (!deletcontact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send(
    );
};


export const contactByIdControl = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);
    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};
export const createContactController = async (req, res) => {
    const contact = await createNewContact(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact
    });
};
// щоб функція updateContactById могла не тільки оновлювати, але й створювати ресурс при його відсутності, необхідно їй аргументом додатково передати { upsert: true }.
export const upsertContactControl = async (req, res, next) => {
    const { contactId } = req.params;
    const resultUpdate = await updateContactById(contactId, req.body, {
        upsert: true,
    });
    if (!resultUpdate) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    const status = resultUpdate.isNew ? 201 : 200;
    res.status(status).json({
        status: 200,
        massage: 'Successfully upserted a contact!',
        data: resultUpdate.contact,
    });
};
// Оскільки ми вже маємо функцію сервісу updateContactById, але ми не будемо під час виклику нічого передавати третім аргументом options
export const patchContactControl = async (req, res, next) => {
    const { contactId } = req.params;
    const resultPatch = await updateContactById(contactId, req.body);
    if (!resultPatch) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.json({
        status: 200,
        massage: 'Successfully patched a contact!',
        data: resultPatch.contact,
    });
};

// Після цього використаємо контролери у файлі роутів.
// router.get('/contacts/:contactId', async (req, res, next)
