import ContactsCollection from "../db/contacts.js";

export const getContacts=() => ContactsCollection.find({});

export const getContactById = (contactId) => ContactsCollection.find({_id: contactId});