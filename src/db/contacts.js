import {Schema, model} from "mongoose";

const movieSchema = new Schema({
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
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal',
    },
 

},
{
    timestamps: true,
},)

const ContactsCollection = model('Contacts', movieSchema);
export default ContactsCollection;