import { Router } from 'express';

const router = Router();
import {
    contactAllControl, contactByIdControl, createContactController,
    deleteContactControl, upsertContactControl, patchContactControl
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactsSchema, updateContactsSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

router.get('/', ctrlWrapper(contactAllControl));
router.get('/:contactId', isValidId, ctrlWrapper(contactByIdControl));
router.post('/', validateBody(createContactsSchema), ctrlWrapper(createContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactControl));
router.put('/:contactId', isValidId, validateBody(updateContactsSchema), ctrlWrapper(upsertContactControl));
router.patch('/:contactId', isValidId, validateBody(updateContactsSchema), ctrlWrapper(patchContactControl));
// прибираю ендпоінт (/contacts) щоб не повторювати і додаю при виклику на сервері першим аргументом
export default router;
