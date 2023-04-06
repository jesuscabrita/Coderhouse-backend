import { Router } from "express";
import { ProductsDataBase } from "../controllers/products.js";

const router = Router();
const productDataBase = new ProductsDataBase();

router.get("/realtimeproducts", async(req, res) => {
    const productos = await productDataBase.getProducts();
    res.render("realtimeproducts", { title: "realtimeproducts", productos: productos });
});

router.get("/", async(req, res) => {
    const productos = await productDataBase.getProducts();
    res.render("home", { title: "home",productos: productos });
});

router.get("/chat", async(req, res) => {
    
    res.render("chat", { title: "chat" });
});

export default router;