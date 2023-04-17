import { model, Schema } from "mongoose";
import { productsModel } from "./products.js";

const cartsCollection = "carts";

const productSchema = new Schema(
    {
        quantity: { type: Number },
        product: { type: Schema.Types.ObjectId, ref: productsModel },
    }
);

const cartsSchema = new Schema(
    {
        products: { type: [productSchema], required: true },
    },
    { timestamps: true }
);

export const cartsModel = model(cartsCollection, cartsSchema);