import { cartsModel } from "../dao/models/carts.js";
import { userModel } from "../dao/models/user.js";

export class CartRepository {
    static instance = null;

    static getInstance() {
        if (!CartRepository.instance) {
            CartRepository.instance = new CartRepository();
        }
        return CartRepository.instance;
    }
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
        let cartIndex = carts.findIndex((c) => c._id == cart.id);
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
    };

    getUser = async () => {
        const data = await userModel.find();
        const user = data.map((user) => user.toObject());
        return user;
    }
}
