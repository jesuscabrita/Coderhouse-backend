import { Router } from "express";
import { checkLogged, checkLogin } from "../middlewares/auth.js";
import { passportCall } from "../middlewares/passportCall.js";
import { authorization } from "../middlewares/authorization.js";
import { getAdmin, getCartById, getChat, getHomeProduct, getLogin, getProduct, getProductById, getProfile, getRealtimeproducts, getRegister, getlogout } from "../controllers/views.js";

const router = Router();

router.get("/login", checkLogged, getLogin);
router.get("/register", checkLogged, getRegister);
router.get("/profile", checkLogin, getProfile);
router.get('/logout', getlogout);

router.get("/products", checkLogin, getProduct);
router.get("/product/:pid", checkLogin, getProductById);
router.get("/cart/:cid", checkLogin, getCartById);
router.get("/admin", checkLogin, passportCall("jwt"), authorization("admin") , getAdmin);
router.get("/realtimeproducts", checkLogin, getRealtimeproducts);
router.get("/", checkLogin, getHomeProduct);
router.get("/chat", checkLogin, getChat);

export default router;