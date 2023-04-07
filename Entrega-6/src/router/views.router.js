import { Router } from "express";
import { ProductsDataBase } from "../controllers/products.js";
import { ChatDataBase } from "../controllers/chat.js";

const router = Router();
const productDataBase = new ProductsDataBase();
const chatDataBase = new ChatDataBase()

router.get("/realtimeproducts", async(req, res) => {
    const productos = await productDataBase.getProducts();
    res.render("realtimeproducts", { title: "realtimeproducts", productos: productos });
});

router.get("/", async(req, res) => {
    const productos = await productDataBase.getProducts();
    res.render("home", { title: "home",productos: productos });
});

router.get("/chat", async(req, res) => {
    const messages = await chatDataBase.getMessages();
    res.render("chat", { title: "chat",messages: messages });
});

export default router;