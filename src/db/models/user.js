import { model, Schema } from 'mongoose';
import { emailRegexp } from '../../constants/user.js';
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const User = new Schema(
    {
        name: { type: String, requirerd: true },
        email: { type: String, match: emailRegexp, requirerd: true, unique: true },
        password: { type: String, requirerd: true },
        verify: { type: Boolean, default: false, required: true },
    },
    { versionKey: false, timestamps: true },
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


// треба знайти у Богдана та додати властивості до verify: { type: String },





