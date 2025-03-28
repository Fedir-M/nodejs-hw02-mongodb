import ContactsCollection from "../db/contacts.js";

export const getContacts = async () => {
    return await ContactsCollection.find({})
};

export const getContactById = async (id) => {
    return await ContactsCollection.findById(id)
};