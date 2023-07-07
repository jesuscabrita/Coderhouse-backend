import { UserRepository } from "../repositories/userRepository.js";
import { createHash, isValidPassword } from "../../middlewares/hash.js";
import jwt from "jsonwebtoken";
import { UserErrors } from "../../error/diccionario.error.js";
import { CustomError } from "../../error/CustomError.js";

export class UserService {
    static instance = null;

    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    constructor() {
        this.userRepository = UserRepository.getInstance();
    }

    generateToken = (userId, expiresIn) => {
        const token = jwt.sign({ userId }, 'secret', { expiresIn });
        return token;
    }

    isValidResetToken = async (token) => {
        try {
            const decodedToken = jwt.verify(token, 'secret');

            const currentTimestamp = Math.floor(Date.now() / 1000);
            const isTokenExpired = decodedToken.exp < currentTimestamp;

            if (isTokenExpired) {
                return false;
            }

            const validTokens = [decodedToken.userId];
            const isTokenValid = validTokens.includes(decodedToken.userId);

            return isTokenValid;
        } catch (error) {
            return false;
        }
    };

    getUser = async () => {
        const data = await this.userRepository.modelGetUser();
        const user = data.map((user) => user.toObject());
        return user;
    }

    getUserById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u._id == uid);
        return user;
    };

    findByEmail = async (email) => {
        const users = await this.getUser();
        const user = users.find((u) => u.email == email);
        return user;
    }

    getUserCartById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u.cart._id == uid);
        return user;
    };

    registerUser = async (first_name, last_name, email, age, password, cart) => {
        try {
            const userExists = await this.userRepository.modelRegisterAndLogin(email);
            if (userExists) {
                const userError = UserErrors(email).USER_EXISTENTE_ERROR;
                const errorUser = CustomError.generateCustomError(
                    userError.name,
                    userError.message,
                    userError.cause
                );
                return { status: 'error', error: errorUser.message };
            }
            const cart = await this.userRepository.modelCartCreate();

            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart,
                role: "usuario",
            };
            await this.userRepository.modelUserCreate(user);
            return { status: "success", message: "Usuario registrado" };
        } catch (error) {
            const userError = UserErrors(email).REGISTRATION_ERROR;
            const errorUser = CustomError.generateCustomError(
                userError.name,
                userError.message,
                userError.cause
            );
            return { status: "error", error: errorUser.message };
        }
    };

    loginUser = async (email, password, req, res) => {
        try {
            const user = await this.userRepository.modelRegisterAndLogin(email);
            if (!user) {
                const userError = UserErrors(email).CORREO_ERROR;
                const errorUser = CustomError.generateCustomError(
                    userError.name,
                    userError.message,
                    userError.cause
                );
                return { status: "error", error: errorUser.message };
            }

            const validPassword = isValidPassword(user, password);
            if (!validPassword) {
                const userError = UserErrors(email).CONTRASEÑA_ERROR;
                const errorUser = CustomError.generateCustomError(
                    userError.name,
                    userError.message,
                    userError.cause
                );
                return { status: "error", error: errorUser.message };
            }

            const { email: userEmail, role: userRole } = user;
            const token = jwt.sign({ email: userEmail, role: userRole }, "userKey", {
                expiresIn: "24h",
            });

            console.log('token', token);

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
            const userError = UserErrors(email).LOGIN_ERROR;
            const errorUser = CustomError.generateCustomError(
                userError.name,
                userError.message,
                userError.cause
            );
            return { status: "error", error: errorUser.message };
        }
    };

    logoutUser = async (req) => {
        try {
            req.session.destroy();
            return { status: "success", message: "Sesión cerrada" };
        } catch (error) {
            const userError = UserErrors(email).USER_LOGOUT_ERROR;
            const errorUser = CustomError.generateCustomError(
                userError.name,
                userError.message,
                userError.cause
            );
            return { status: "error", error: errorUser.message };
        }
    };

    sendPasswordResetEmail = async (user, resetToken) => {
        const transporter = this.userRepository.createTransportCorreo();
        const correo = this.userRepository.correoTextEnCola(user, resetToken);
        try {
            const info = await this.userRepository.enviarCorreo(transporter, correo);
            console.log(`Correo electrónico enviado: ${info.messageId}`);
        } catch (error) {
            console.error(error);
        }
    };

    solicitarContraseña = async (email) => {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error('Correo electrónico no encontrado');
            }
            const resetToken = this.generateToken(user.id, '4m');

            this.isValidResetToken(resetToken);

            await this.userRepository.saveResetToken(user._id, resetToken);

            await this.sendPasswordResetEmail(email, resetToken);

        } catch (error) {
            throw error;
        }
    }

    restablecerContraseña = async (email, newPassword) => {
        try {
            const user = await this.findByEmail(email);
            console.log('usuario', user);

            if (!user) {
                throw new Error("No se encuentra ese usuario");
            }
            const isSamePassword = isValidPassword(user, newPassword);
            if (isSamePassword) {
                throw new Error("No puedes usar la misma contraseña anterior.");
            }
            const hashedPassword = createHash(newPassword);
            await this.userRepository.modelUpdateUserPassword(email, hashedPassword);

            return { status: "success", message: "Contraseña restablecida correctamente." };
        } catch (error) {
            console.error(error);
            return { status: "error", error: "Error interno: " + error.message };
        }
    };

    editarUsuario = async (userId, changes) => {
        try {
            const usuarios = await this.getUser();
            const usuarioIndex = usuarios.findIndex((user) => user._id == userId);
            if (usuarioIndex === -1) {
                throw new Error(`No se encontró el usuario con ID ${userId}`);
            }
            const updatedUser = {
                ...usuarios[usuarioIndex],
                ...changes,
            };
            usuarios[usuarioIndex] = updatedUser;
            await this.userRepository.modelUserEdit(userId, updatedUser);
            return updatedUser;
        } catch (error) {
            throw new Error('no se pudo editar , error interno')
        }
    }
}