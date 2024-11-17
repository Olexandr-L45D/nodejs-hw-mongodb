import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema, requestResetEmailSchema, resetPasswordSchema } from '../validation/auth.js';
import { loginUserController, logoutUserController, registerUserController, refreshUserSessionController, requestResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post('/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController)
);
authRouter.post('/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController)
);
authRouter.post('/logout',
    ctrlWrapper(logoutUserController)
);
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

authRouter.post(
    '/request-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);
authRouter.post(
    '/reset-password',
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController),
);
export default authRouter;
