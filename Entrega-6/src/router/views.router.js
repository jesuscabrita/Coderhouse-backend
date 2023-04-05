import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/realtimeproducts", async(req, res) => {
    const productos = await productManager.getProducts();
    res.render("realtimeproducts", { title: "realtimeproducts", productos: productos });
});

router.get("/", async(req, res) => {
    const productos = await productManager.getProducts();
    res.render("home", { title: "home",productos: productos });
});

export default router;