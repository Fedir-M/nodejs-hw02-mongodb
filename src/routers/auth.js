import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import {
  authRegisterScheme,
  authLoginSchema,
} from '../validation/authValidationSchemes.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/authControllers.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterScheme),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;
