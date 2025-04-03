import {Router} from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {getContactsController, getContactsByIdController, createContactController, updateContactController, deleteContactController} from "../controllers/contacts.js";


const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController)); 

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', ctrlWrapper(createContactController));

contactsRouter.patch('/:contactId', ctrlWrapper(updateContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

 export default contactsRouter;