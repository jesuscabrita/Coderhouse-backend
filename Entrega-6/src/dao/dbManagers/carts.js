import { model, Schema } from "mongoose";

const cartsCollection = "carts";

const productSchema = new Schema({
    quantity: { type: Number, required: true },
    id: { type: Number, required: true },
});

const cartsSchema = new Schema(
    {
        products: { type: [productSchema], required: true },
    },
    { timestamps: true }
);

export const cartsModel = model(cartsCollection, cartsSchema);