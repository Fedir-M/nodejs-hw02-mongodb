import { typeListContact } from '../../constants/contactsConst.js';

export const parseContactFilterParams = ({ type, isFavourite }) => {
  const parsedTypeFilter = typeListContact.includes(type) ? type : undefined;

  const parsedFavouriteFilter =
    isFavourite !== undefined ? isFavourite === 'true' : undefined;

  return {
    contactType: parsedTypeFilter,
    isFavourite: parsedFavouriteFilter,
  };
};
