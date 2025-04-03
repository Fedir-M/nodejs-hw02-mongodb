import { getContacts, getContactById, createContact, updateContact, deleteContactById } from "../services/contacts.js";
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {

    const data = await getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data, // дані, отримані в результаті обробки запиту
    });
}

export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;
    const data = await getContactById(contactId);

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data,
    });
  }

  export const createContactController = async (req, res) => {
    const newContact = await createContact(req.body);


  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
  };

  export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    
    res.json({
      status: 200,
      message: "Successfully patched a contact!", 
      data: updatedContact,
    });
  }

  export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  }