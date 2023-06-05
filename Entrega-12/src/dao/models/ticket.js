import { model, Schema } from "mongoose";
import { productsModel } from "./products.js";

const ticketCollection = "ticket";

const ticketSchema = new Schema(
    {
        code: { type: String, unique: true },
        purcharse_datetime: { type: Date },
        amount: { type: Number },
        purcharse: { type: String },
        products: { type: [productsModel.schema] },
        userID: { type : String },
    }
);

export const ticketModel = model(ticketCollection, ticketSchema);