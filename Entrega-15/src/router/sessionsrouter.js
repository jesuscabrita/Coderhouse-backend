import express from "express";
import { cambioContraseña, getUser, loginUser, logoutUser, registerUser, solicitarContraseña } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/solicitar", solicitarContraseña);
router.post("/cambiar", cambioContraseña);

export default router;