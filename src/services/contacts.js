import ContactsCollection from "../db/contacts.js";

export const getContacts = async () => {
    return await ContactsCollection.find({})
};

export const getContactById = async (id) => {
    return await ContactsCollection.findById(id)
};

export const createContact = async (payload) => {
  
  const newContact = await ContactsCollection.create(payload);
  return newContact;
  };

  export const updateContact = async (id, payload) => {
    const updatedContact = await ContactsCollection.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return updatedContact;
  }

  export const deleteContactById = async (id) => await ContactsCollection.findByIdAndDelete(id);