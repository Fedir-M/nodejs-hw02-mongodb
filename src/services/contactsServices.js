import { v2 as cloudinary } from 'cloudinary';
import ContactsCollection from '../db/contactsModel.js';

import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

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
  return await ContactsCollection.findOne({ _id: id, userId });
};

export const createContact = async (payload, userId, file) => {
  let photo = null;
  if (file) {
    photo = await saveFileToCloudinary(file);
  }
  return await ContactsCollection.create({ ...payload, userId, photo });
};

export const updateContact = async (id, payload, userId, file) => {
  let updatePayload = { ...payload };
  if (file) {
    const contact = await ContactsCollection.findOne({ _id: id, userId });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    if (contact.photo) {
      const publicId = contact.photo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`contacts/${publicId}`);
    }
    updatePayload.photo = await saveFileToCloudinary(file);
  }

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    updatePayload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContactById = async (id, userId) =>
  await ContactsCollection.findOneAndDelete({ _id: id, userId });
