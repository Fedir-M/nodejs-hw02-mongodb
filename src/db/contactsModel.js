import { Schema, model } from 'mongoose';
import { typeListContact } from '../constants/contactsConst.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

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

    photo: {
      type: String,
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },

    contactType: {
      type: String,
      required: true,
      enum: typeListContact,
      // default: typeListContact[0],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
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
