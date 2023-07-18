import express from "express";
import { addCarts, addProducts, editProduct, editQuantity, getCartById, getCarts, productDelete } from "../controllers/carts.js";
import { authorization } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", getCarts);
router.get("/:cid", getCartById);
router.post("/", addCarts);
router.post("/:cid/product/:pid",authorization("usuario") ,addProducts);
router.delete("/:cid/products/:pid", productDelete);
router.put("/:cid", editProduct);
// router.put("/:cid/products/:pid", editQuantity);

export default router;