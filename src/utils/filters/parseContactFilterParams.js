import { typeListContact } from '../../constants/contactsConst.js';

export const parseContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedTypeFilter = typeListContact.includes(contactType)
    ? contactType
    : undefined;

  const parsedFavouriteFilter =
    isFavourite !== undefined ? isFavourite === 'true' : undefined;

  return {
    contactType: parsedTypeFilter,
    isFavourite: parsedFavouriteFilter,
  };
};
