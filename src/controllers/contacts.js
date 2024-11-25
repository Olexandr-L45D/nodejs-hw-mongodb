import {
    getAllContacts, getContactsById,
    createNewContact, deletContactById, updateContactById
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { sortByList } from '../db/models/ContactsCollection.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parsFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const contactAllControl = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parsFilterParams(req.query);
    const { _id: userId } = req.user;
    filter.userId = userId;
    const contacts = await getAllContacts({
        page, perPage,
        sortBy, sortOrder,
        filter,
    });
    res.json({
        status: 200,
        message: 'Successfully found contacts',
        data: contacts
    });
};

export const createContactController = async (req, res) => {

    const { _id: userId } = req.user;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const contact = await createNewContact({ ...req.body, userId, photo: photoUrl });
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        contact,
    });
};

export const contactByIdControl = async (req, res, next) => {
    const userId = req.user._id;
    const { contactId } = req.params;
    const contact = await getContactsById(contactId, userId);
    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const deleteContactControl = async (req, res, next) => {
    const userId = req.user._id;
    const { contactId } = req.params;
    const deletcontact = await deletContactById(contactId, userId);
    if (!deletcontact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send(
    );
};
// щоб функція updateContactById могла не тільки оновлювати, але й створювати ресурс при його відсутності, необхідно їй аргументом додатково передати { upsert: true }.
export const upsertContactControl = async (req, res, next) => {
    const userId = req.user._id;
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }
    const resultUpdate = await updateContactById(contactId, userId, { ...req.body, photo: photoUrl }, {
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
    const userId = req.user._id;
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const resultPatch = await updateContactById(contactId, userId, { ...req.body, photo: photoUrl });
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

// Feature flag -(env('ENABLE_CLOUDINARY') === 'true') (тобто активний!) - (флаг функції або функціональний флаг)



