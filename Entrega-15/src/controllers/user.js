import { UserService } from "../dao/services/userService.js";

const userService = UserService.getInstance();

export const getUser = async (req, res) => {
    try {
        const user = await userService.getUser();
        res.status(200).send({ user });
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart } = req.body;
        const result = await userService.registerUser(
            first_name,
            last_name,
            email,
            age,
            password,
            cart
        );

        if (result.status === "error") {
            return res.status(400).send(result);
        } else {
            return res.send(result);
        }
    } catch (error) {
        return res.status(500).send({ status: "error", error: error });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password, req, res);
        if (result.status === "error") {
            return res.status(400).send(result);
        }
        res.send(result);
    } catch (error) {
        return res.status(500).send({ status: "error", error: error });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const result = await userService.logoutUser(req);
        if (result.status === "error") {
            return res.status(400).send(result);
        } else {
            return res.send(result);
        }
    } catch (error) {
        return res.status(500).send({ status: "error", error: error });
    }
};

export const solicitarContraseña = async (req, res) => {
    try {
        const { email } = req.body;
        await userService.solicitarContraseña(email);
        return res.status(200).send({ status: "success", message: "Solicitud de restablecimiento de contraseña enviada correctamente." });
    } catch (error) {
        return res.status(500).send({ status: "error", error: error.message });
    }
};

export const cambioContraseña = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        // Llamar al método restablecerContraseña del servicio UserService
        const result = await userService.restablecerContraseña(userId,newPassword);

        if (result.status === "success") {
            return res.status(200).send({ status: "success", message: result.message });
        } else {
            return res.status(400).send({ status: "error", error: result.error });
        }
    } catch (error) {
        return res.status(500).send({ status: "error", error: error.message });
    }
};