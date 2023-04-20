import { model, Schema } from "mongoose";

const userCollection = "user";

const userSchema = new Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        email: { type: String },
        age: { type: Number },
        role: { type: String },
        password: { type: String },
    }
);

export const userModel = model(userCollection, userSchema);