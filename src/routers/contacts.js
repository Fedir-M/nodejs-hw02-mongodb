import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
  handleMissingIdController,
} from '../controllers/contactsControllers.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contactsValidationSchemes.js';
import { authenticate } from '../middlewares/authenticate.js';

import { isValid } from '../middlewares/isValidID.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValid,
  ctrlWrapper(getContactsByIdController),
);

contactsRouter.get('/$', ctrlWrapper(handleMissingIdController));

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValid,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(updateContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValid,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
