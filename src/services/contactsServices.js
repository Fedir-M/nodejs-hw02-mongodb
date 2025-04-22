import ContactsCollection from '../db/contactsModel.js';

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

  if (filters.userId) {
    contactQuery.where('userId').equals(filters.userId);
  }

  if (filters.contactType) {
    contactQuery.where('contactType').equals(filters.contactType);
  }

  if (filters.isFavourite === true) {
    contactQuery.where('isFavourite').equals(true);
  }
  // ==================== /filter's block ====================
  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // const totalItems = await ContactsCollection.find()
  //   .merge(contactQuery)
  //   .countDocuments();

  //* более понятнее єтим способом
  const totalItems = await contactQuery.clone().countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  return await ContactsCollection.findById({ _id: id, userId });
};

export const createContact = async (payload) => {
  const newContact = await ContactsCollection.create(payload);
  return newContact;
};

export const updateContact = async (id, payload, userId) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContactById = async (id, userId) =>
  await ContactsCollection.findByIdAndDelete({ _id: id, userId });
