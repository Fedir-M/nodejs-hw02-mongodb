import ContactsCollection from '../db/contacts.js';

import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  // ==================== filter's block ====================
  const contactQuery = ContactsCollection.find();
  if (filters.contactType) {
    contactQuery.where('contactType').equals(filters.contactType);
  }

  if (filters.isFavourite === true) {
    contactQuery.where('isFavourite').equals(true);
  }
  // ==================== /filter's block ====================
  const items = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const totalItems = await ContactsCollection.find()
    .merge(contactQuery)
    .countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    items,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactById = async (id) => {
  return await ContactsCollection.findById(id);
};

export const createContact = async (payload) => {
  const newContact = await ContactsCollection.create(payload);
  return newContact;
};

export const updateContact = async (id, payload) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    id,
    payload,
  );
  return updatedContact;
};

export const deleteContactById = async (id) =>
  await ContactsCollection.findByIdAndDelete(id);
