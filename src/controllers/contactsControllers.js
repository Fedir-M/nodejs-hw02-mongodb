import { contactSortFields } from '../db/contactsModel.js';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContactById,
} from '../services/contactsServices.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilterParams(req.query);
  filters.userId = req.user._id;
  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    filters,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data, // дані, отримані в результаті обробки запиту
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const data = await getContactById(contactId, userId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully found contact with id {contactId}!',
    data,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const newContact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updatedContact = await updateContact(contactId, req.body, userId);

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const deletedContact = await deleteContactById(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const handleMissingIdController = async () => {
  throw createHttpError(400, 'Contact ID is missing');
};
