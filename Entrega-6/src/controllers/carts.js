import { cartsModel } from "../models/carts.js";

export class CartsDataBase {
    constructor() { }

    getCarts = async () => {
        const data = await cartsModel.find();
        const carts = data.map((cart) => cart.toObject());
        return carts;
    };

    getCartById = async (cid) => {
        const carts = await this.getCarts();
        const cart = carts.find((u) => u._id == cid);
        return cart;
    };

    addCart = async (cart) => {
        const carts = await this.getCarts();
        let cartIndex = carts.findIndex(c => c._id == cart.id);
        if (cartIndex === -1) {
            cartIndex = carts.length;
            carts.push({
                products: [],
            });
        } else {
            carts[cartIndex].products = cart.products;
        }
        const createdCart = await cartsModel.create(cart);
        return createdCart.toObject();
    }

    addProducts = async (productID, carritoID, quantity, product)=>{
        const carritos = await this.getCarts();
        const indiceCart = carritos.findIndex((e) => e._id == carritoID);
        const indiceProduct = carritos[indiceCart].products.findIndex((e) => e._id == productID);

        if (!quantity) {
            carritos[indiceCart].products[indiceProduct].quantity++
        }
        if (indiceProduct !== -1) {
            carritos[indiceCart].products[indiceProduct].quantity += quantity
        }
        else {
            carritos[indiceCart].products.push(product)
        }

        const updatedCart = await cartsModel.findByIdAndUpdate(carritos[indiceCart]._id, carritos[indiceCart], { new: true });

        return updatedCart.toObject()
    }
}