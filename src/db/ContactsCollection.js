// src/db / models / student.js

import { model, Schema } from 'mongoose';
import { typeList } from '../constants/contacts.js';

const contactsSchema = new Schema(
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
            enum: typeList,
            required: true,
            default: 'personal',
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
// роблю хук додаткової валідації на схемі
contactsSchema.post('save', (error, data, next) => {
    console.log("after save middleware");
    next();

});

export const ContactsCollection = model('contacts', contactsSchema);




// timestamps: true при створенні моделі.Це додає до об'єкту два поля:
// createdAt(дата створення) та updatedAt(дата оновлення), і їх не потрібно додавати вручну.
