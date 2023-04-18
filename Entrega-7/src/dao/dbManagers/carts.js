import { cartsModel } from "../models/carts.js";
import { productsModel } from "../models/products.js";

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

    addProducts = async (productId, carritoId, quantity) => {
    const carritos = await this.getCarts();
    const indiceCart = carritos.findIndex((e) => e._id == carritoId);

    // Busca el producto en la colección de productos
    const product = await productsModel.findById(productId);

    if (!product) {
        throw new Error(`No se encontró el producto con id ${productId}`);
    }

    // Busca el producto en el carrito
    const indiceProduct = carritos[indiceCart].products.findIndex(
        (e) => e.product._id.toString() == productId
    );

    if (!quantity) {
        quantity = 1;
    }

    // Si el producto ya existe en el carrito, actualiza su cantidad
    if (indiceProduct !== -1) {
        carritos[indiceCart].products[indiceProduct].quantity += quantity;
    } else {
        // Si el producto no existe en el carrito, agrégalo
        carritos[indiceCart].products.push({
            quantity: quantity,
            product: product
        });
    }

    const updatedCart = await cartsModel.findByIdAndUpdate(
        carritos[indiceCart]._id,
        carritos[indiceCart],
        { new: true }
    );

    return updatedCart.toObject();
}

    eliminarProducto = async (productID, cartID) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((c) => c._id == cartID);
        if (cartIndex === -1) {
            throw new Error("El carrito no existe");
        }
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex((p) => p._id == productID);
        if (productIndex === -1) {
            throw new Error("El producto no existe en el carrito");
        }
        cart.products.splice(productIndex, 1);
        const updatedCart = await cartsModel.findByIdAndUpdate(cart._id, cart, {
            new: true,
        });
        return updatedCart.toObject();
    };

    eliminarTodosLosProductos = async (cartID) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((c) => c._id == cartID);
        if (cartIndex === -1) {
            throw new Error("El carrito no existe");
        }
        const cart = carts[cartIndex];
        cart.products = [];
        const updatedCart = await cartsModel.findByIdAndUpdate(cart._id, cart, {
            new: true,
        });
        return updatedCart.toObject();
    };

    editarCart = async (cartID, newProducts) => {
        const carts = await this.getCarts();
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
        const carts = await this.getCarts();
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
