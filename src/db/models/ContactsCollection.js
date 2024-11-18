import { model, Schema } from 'mongoose';
import { typeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from "./hooks.js";

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
        userId: { type: Schema.Types.ObjectId, ref: 'users' },
        photo: { type: String },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
export const sortByList = ["name", "phoneNumber", "email", "isFavourite"];

contactsSchema.post('save', (error, data, next) => {
    console.log("after save middleware");
    next();

});

contactsSchema.post("save", handleSaveError);

contactsSchema.pre("findOneAndUpdate", setUpdateSettings);

contactsSchema.post("findOneAndUpdate", handleSaveError);

export const ContactsCollection = model('contacts', contactsSchema);











// роблю хук додаткової валідації на схемі
// contactsSchema.post('save', (error, data, next) => {
//     console.log("after save middleware");
//     next();

// });
// timestamps: true при створенні моделі.Це додає до об'єкту два поля: createdAt(дата створення) та updatedAt(дата оновлення), і їх не потрібно додавати вручну.
