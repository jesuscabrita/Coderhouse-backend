import { model, Schema } from "mongoose";

const productsCollection = "products";

const productsSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true},
        thumbnail: { type: [String], default: []},
        code: { type: String },
        stock: { type: Number },
        status: {type: Boolean },
        category: {type: String},
    },
    { timestamps: true }
);

export const productsModel = model(productsCollection, productsSchema);