import { Router } from "express";
import { ChatDataBase } from "../dao/dbManagers/chat.js";
import { ProductsDataBase } from "../dao/dbManagers/products.js";
import { CartsDataBase } from "../dao/dbManagers/carts.js";

const router = Router();
const productDataBase = new ProductsDataBase();
const chatDataBase = new ChatDataBase()
const cartsDataBase = new CartsDataBase()

router.get("/products", async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const {
        payload: products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
    } = await productDataBase.getProducts(limit, page, query);

    return res.render("products", {
        products: products,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
    });

});

router.get("/cart/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsDataBase.getCartById(cid);
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.render("cart", { title: "Cart", cart: cart });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const productos = await productDataBase.getProducts(limit, page, query);
    res.render("realtimeproducts", { title: "realtimeproducts", productos: productos });
});

router.get("/", async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const productos = await productDataBase.getProducts(limit, page, query);
    res.render("home", { title: "home", productos: productos });
});

router.get("/chat", async (req, res) => {
    const messages = await chatDataBase.getMessages();
    res.render("chat", { title: "chat", messages: messages });
});

export default router;