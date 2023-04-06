import express from "express";
import fs from "fs";
import CartsManager from "../dao/fileManagers/cartsManager.js";

const router = express.Router();

const cartManager = new CartsManager();

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.status(200).send({ status: "Succes", message: "OK", cart });
    }
});

router.post("/", async (req, res) => {
    try {
        const cartId = parseInt(req.params.id);
        const cart = req.body;
        cart.id = cartId;
        const updatedCart = await cartManager.addCart(cart);
        return res.status(201).send({ status: 'Succes', message: 'Se creo el carritoo correctamente', updatedCart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const product = req.body;
        const productID = Number(req.params.pid);
        const carritoID = Number(req.params.cid);
        product.id = productID;
        
        const cart = await cartManager.addProducts(productID, carritoID, product.quantity, product);

        return res.status(201).send({ status: 'Success', message: 'Se creo el producto correctamente', result: cart });
    } catch (err) {
        return res.status(400).send({ status: "Error", error: err.message });
    }
});

export default router;