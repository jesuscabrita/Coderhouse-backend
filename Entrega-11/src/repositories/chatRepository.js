import { messagesModel } from "../dao/models/messages.js";

export class ChatRepository {
    static instance = null;

    static getInstance() {
        if (!ChatRepository.instance) {
            ChatRepository.instance = new ChatRepository();
        }
        return ChatRepository.instance;
    }
    constructor() { }

    getMessages = async () => {
        try {
            const data = await messagesModel.find();
            const messages = data.map(message => message.toObject());
            return messages;
        } catch (error) {
            throw new Error("Error al obtener los mensajes");
        }
    }
}