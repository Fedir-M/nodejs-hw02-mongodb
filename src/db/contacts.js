import { Schema, model } from 'mongoose';
import { typeListContact } from '../constants/contactsConst.js';
import { handleSaveError, setUpdateSettings } from '../db/hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },

    contactType: {
      type: String,
      enum: typeListContact,
      default: typeListContact[0],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ============== hooks ==============

contactSchema.post('save', handleSaveError);

contactSchema.pre('findByIdAndUpdate', setUpdateSettings);

contactSchema.post('findByIdAndUpdate', handleSaveError);

// ============== /hooks ==============

export const contactSortFields = ['name'];

const ContactsCollection = model('contact', contactSchema);
export default ContactsCollection;
