// new model to BD for User on auth
import { model, Schema } from 'mongoose';

const User = new Schema(
    {
        name: { type: String, requirerd: true },
        email: { type: String, requirerd: true, unique: true },
        password: { type: String, requirerd: true },
        createdAt: { type: Date },
        updatedAt: { type: Date },

    },
    { timestamps: true, varsionKey: false },
);
User.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UsersCollection = model('users', User);










// import { ROLES } from '../constants/index.js';
// role: {
//     type: String,
//             enum: [ROLES.TEACHER, ROLES.PARENT],
//             default: ROLES.PARENT,
//         },
