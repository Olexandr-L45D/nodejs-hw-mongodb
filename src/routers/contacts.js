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
// прибираю ендпоінт щоб не повторювати і додаю при виклику на сервері першим аргументом
// router.get('/contacts', ctrlWrapper(contactAllControl));
// router.get('/contacts/:contactId', ctrlWrapper(contactByIdControl));
// router.post('/contacts', ctrlWrapper(createContactController));
// router.delete('/contacts/:contactId', ctrlWrapper(deleteContactControl));
// router.put('/contacts/:contactId', ctrlWrapper(upsertContactControl));
// router.patch('/contacts/:contactId', ctrlWrapper(patchContactControl));

export default router;

// http://localhost:3000/contacts - in Postmen - ми отримаємо масив усіх contacts
// http://localhost:3000/contacts/:contactId - one contacts
