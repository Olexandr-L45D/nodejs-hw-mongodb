// src/db / models / student.js

import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
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
    },
);
export const ContactsCollection = model('contacts', contactsSchema);

// timestamps: true при створенні моделі.Це додає до об'єкту два поля:
// createdAt(дата створення) та updatedAt(дата оновлення), і їх не потрібно додавати вручну.
