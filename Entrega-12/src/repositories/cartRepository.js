import { cartsModel } from "../dao/models/carts.js";
import { productsModel } from "../dao/models/products.js";
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

    modelGetCart = () => {
        return cartsModel.find();
    }

    modelGetUser = () => {
        return  userModel.find();
    }

    modelCartCreate = (cart) => {
        return cartsModel.create(cart)
    }

    modelUserfindByIdAndUpdate = (carritoID, carrito) => {
        return userModel.findByIdAndUpdate(carritoID, carrito, { new: true })
    }

    modelCartfindByIdAndUpdate = (cartId, newProducts) => {
        return cartsModel.findByIdAndUpdate(cartId, { products: newProducts }, { new: true })
    }

    modelCartQuantity = (cartId, cart) => {
        return cartsModel.findByIdAndUpdate(cartId, cart, { new: true })
    }

    modelProductAdd = (productId) => {
        return productsModel.findById(productId)
    }
}
