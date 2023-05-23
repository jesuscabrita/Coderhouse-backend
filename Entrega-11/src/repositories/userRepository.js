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

    getUser = async () => {
        const data = await userModel.find();
        const user = data.map((user) => user.toObject());
        return user;
    }

    getUserById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u._id == uid);
        return user;
    };

    getUserCartById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u.cart._id == uid);
        return user;
    };
}
