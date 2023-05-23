import { cartsModel } from "../dao/models/carts.js";
import { userModel } from "../dao/models/user.js";
import { createHash, isValidPassword } from "../middlewares/hash.js";
import jwt from "jsonwebtoken";

export class UserService {
    static instance = null;

    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    constructor() { }

    registerUser = async (first_name, last_name, email, age, password, cart) => {
        try {
            const userExists = await userModel.findOne({ email });
            if (userExists) {
                return { status: "error", error: `El usuario ${email} ya existe` };
            }
            const cart = await cartsModel.create({ products: [] });

            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart,
                role: "usuario",
            };
            await userModel.create(user);
            return { status: "success", message: "Usuario registrado" };
        } catch (error) {
            return { status: "error", error: "Error interno del servidor" };
        }
    };

    loginUser = async (email, password, req, res) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return { status: "error", error: "Correo electrónico incorrecto" };
            }

            const validPassword = isValidPassword(user, password);
            if (!validPassword) {
                return { status: "error", error: "Contraseña incorrecta" };
            }

            const { email: userEmail, role: userRole } = user;
            const token = jwt.sign({ email: userEmail, role: userRole }, "userKey", {
                expiresIn: "24h",
            });

            res.cookie("tokenCookie", token, { httpOnly: true });

            req.session.user = {
                name: user.first_name,
                apellido: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                role: user.role,
            };

            return {
                status: "success",
                message: "Inició sesión",
                payload: req.session.user,
            };
        } catch (error) {
            return { status: "error", error: "Error interno del servidor" };
        }
    };

    logoutUser = async (req) => {
        try {
            req.session.destroy();
            return { status: "success", message: "Sesión cerrada" };
        } catch (error) {
            return { status: "error", error: "Error interno del servidor" };
        }
    };
}