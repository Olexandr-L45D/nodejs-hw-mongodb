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
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

router.use(authenticate);
router.get('/', ctrlWrapper(contactAllControl));
router.get('/:contactId', isValidId, ctrlWrapper(contactByIdControl));
router.post('/', upload.single('photo'), validateBody(createContactsSchema), ctrlWrapper(createContactController));
router.put('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactsSchema), ctrlWrapper(upsertContactControl));
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactsSchema), ctrlWrapper(patchContactControl));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactControl));
export default router;

























// прибираю ендпоінт (/contacts) щоб не повторювати і додаю при виклику на сервері першим аргументом
