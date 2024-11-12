// new model to BD for User on auth
import { model, Schema } from 'mongoose';
import { emailRegexp } from '../../constants/user.js';
import { handleSaveError, setUpdateSettings } from "./hooks.js";
const User = new Schema(
    {
        name: { type: String, requirerd: true },
        email: { type: String, match: emailRegexp, requirerd: true, unique: true },
        password: { type: String, requirerd: true },
        // createdAt: { type: Date },
        // updatedAt: { type: Date },

    },
    { timestamps: true, varsionKey: false },
);
User.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
User.post("save", handleSaveError);

User.pre("findOneAndUpdate", setUpdateSettings);

User.post("findOneAndUpdate", handleSaveError);

export const UsersCollection = model('users', User);










// import { ROLES } from '../constants/index.js';
// role: {
//     type: String,
//             enum: [ROLES.TEACHER, ROLES.PARENT],
//             default: ROLES.PARENT,
//         },
