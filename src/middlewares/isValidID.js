import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValid = (req, res, next) => {
  const { contactId } = req.params;

  if (!contactId) {
    return next(createHttpError(400, 'Contact ID is missing'));
  }

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, `${contactId} not valid ID`));
  }
  next();
};
