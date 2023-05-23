import { cartsModel } from "../dao/models/carts.js";
import { productsModel } from "../dao/models/products.js";
import { userModel } from "../dao/models/user.js";
import { CartRepository } from "../repositories/cartRepository.js";

export class CartService {
    static instance = null;

    static getInstance() {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }
    constructor() {
        this.cartRepository = CartRepository.getInstance();
    }

    addProducts = async (productId, carritoId, quantity) => {
        try {
            const carritos = await this.cartRepository.getUser();

            const carrito = carritos.find((e) => e.cart._id.toString() === carritoId);

            if (!carrito) {
                throw new Error(`No se encontró el carrito con id ${carritoId}`);
            }

            const product = await productsModel.findById(productId);

            if (!product) {
                throw new Error(`No se encontró el producto con id ${productId}`);
            }

            const indiceProduct = carrito.cart.products.findIndex(
                (e) => e.product._id.toString() === productId
            );

            if (indiceProduct !== -1) {
                carrito.cart.products[indiceProduct].quantity += quantity;
            } else {
                carrito.cart.products.push({
                    quantity: quantity,
                    product: product,
                });
            }

            const updatedCart = await userModel.findByIdAndUpdate(
                carrito._id,
                carrito,
                { new: true }
            );

            return updatedCart.toObject();
        } catch (error) {
            throw error;
        }
    };

    eliminarProducto = async (productId, cartId) => {
        try {
            const carts = await this.cartRepository.getUser();
            const cart = carts.find((e) => e.cart._id.toString() === cartId);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }
    
            const productIndex = cart.cart.products.find((p) => p.product._id.toString() === productId);
    
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito`);
            }
    
            cart.cart.products.splice(productIndex, 1);
    
            const updatedCart = await userModel.findByIdAndUpdate(cart._id, cart, { new: true });
    
            return updatedCart.toObject();
        } catch (error) {
            throw error;
        }
    };

    editarCart = async (cartID, newProducts) => {
        const carts = await this.cartRepository.getCarts();
        const cartIndex = carts.findIndex((c) => c._id == cartID);
        if (cartIndex === -1) {
            throw new Error("El carrito no existe");
        }
        const cart = carts[cartIndex];
        cart.products = newProducts;
        const updatedCart = await cartsModel.findByIdAndUpdate(
            cart._id,
            { products: newProducts },
            { new: true }
        );
        return updatedCart.toObject();
    };

    updateProductQuantity = async (productID, cartID, quantity) => {
        const carts = await this.cartRepository.getCarts();
        const cartIndex = carts.findIndex((c) => c._id == cartID);
        if (cartIndex === -1) {
            throw new Error("El carrito no existe");
        }
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex((p) => p._id == productID);
        if (productIndex === -1) {
            throw new Error("El producto no existe en el carrito");
        }
        cart.products[productIndex].quantity = quantity;
        const updatedCart = await cartsModel.findByIdAndUpdate(cart._id, cart, {
            new: true,
        });
        return updatedCart.toObject();
    };
}