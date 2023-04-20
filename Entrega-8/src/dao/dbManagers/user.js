import { userModel } from "../models/user.js";

export class UserDataBase {
    constructor() { }

    getUser =async ()=>{
        const data = await userModel.find();
        const user = data.map((user) => user.toObject());
        return user;
    }

    registerUser = async (first_name, last_name, email, age, password) => {
        try {
            const userExists = await userModel.findOne({ email });
            if (userExists) {
                return { status: "error", error: `El usuario ${email} ya existe` };
            }

            const user = {
                first_name,
                last_name,
                email,
                age,
                password,
                role: "usuario",
            };
            await userModel.create(user);
            return { status: "success", message: "user registrado" };
        } catch (error) {
            console.log(error);
        }
    };

    loginUser = async (email, password, req) => {
        try {
            const user = await userModel.findOne({ email });
            
            if (!user) {
                return { status: "error", error: "Correo electrónico incorrecto" };
            }
    
            if (user.password !== password) {
                return { status: "error", error: "Contraseña incorrecta" };
            }
            
            req.session.user = {
                name: user.first_name,
                apellido: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
            };
    
            return {
                status: "success",
                message: "Inició sesión",
                payload: req.session.user,
            };
        } catch (error) {
            console.log(error);
            return { status: "error", error: "Error interno del servidor" };
        }
    };

    logoutUser = async (req) => {
        try {
            req.session.destroy();
            return { status: "success", message: "Sesión cerrada" };
        } catch (error) {
            console.log(error);
            return { status: "error", error: "Error interno del servidor" };
        }
    };

}