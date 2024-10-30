import { Router } from 'express';

const router = Router();
import {
    contactAllControl, contactByIdControl, createContactController,
    deleteContactControl, upsertContactControl, patchContactControl
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
router.get('/', ctrlWrapper(contactAllControl));
router.get('/:contactId', ctrlWrapper(contactByIdControl));
router.post('/', ctrlWrapper(createContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactControl));
router.put('/:contactId', ctrlWrapper(upsertContactControl));
router.patch('/:contactId', ctrlWrapper(patchContactControl));
// прибираю ендпоінт (/contacts) щоб не повторювати і додаю при виклику на сервері першим аргументом

export default router;

// http://localhost:3000/contacts - in Postmen - ми отримаємо масив усіх contacts
// http://localhost:3000/contacts/:contactId - one contacts
