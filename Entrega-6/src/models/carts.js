import { model, Schema } from "mongoose";

const cartsCollection = "carts";

const productSchema = new Schema(
    {
        quantity: { type: Number },
    }
);

const cartsSchema = new Schema(
    {
        products: { type: [productSchema], required: true },
    },
    { timestamps: true }
);

export const cartsModel = model(cartsCollection, cartsSchema);