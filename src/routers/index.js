import { Router } from 'express';
import contactsRout from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/contacts', contactsRout);

router.use('/auth', authRouter);

export default router;
