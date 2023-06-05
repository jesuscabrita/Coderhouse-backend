import { cartsModel } from "../dao/models/carts.js";
import { userModel } from "../dao/models/user.js";

export class UserRepository {
    static instance = null;

    static getInstance() {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    constructor() { }

    modelGetUser = () => {
        return userModel.find();
    }

    modelRegisterAndLogin = (email) => {
        return userModel.findOne({ email });
    }

    modelCartCreate = () => {
        return cartsModel.create({ products: [] })
    }

    modelUserCreate = (user) => {
        return userModel.create(user)
    }
}
