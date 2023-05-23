import { messagesModel } from "../dao/models/messages.js";
import { ChatRepository } from "../repositories/chatRepository.js";

export class ChatService {
    static instance = null;

    static getInstance() {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }
    constructor() {
        this.chatRepository = ChatRepository.getInstance();
    }

    validateMessage(message,user) {
        if (!message) {
            throw new Error("El mensaje es requerido");
        }
        if (!user) {
            throw new Error("El usuario es requerido");
        }
    }

    addMessage = async (message, user) => {
        this.validateMessage(message, user);
        const messages = await this.chatRepository.getMessages();
        const newMessage = {
            message: message.trim(),
            user: user.trim()
        }
        messages?.push(newMessage)
        await messagesModel.create(newMessage);
        return newMessage;
    }

    editarMessage = async (id, changes) => {
        const messages = await this.chatRepository.getMessages();
        const messageIndex = messages.findIndex((message) => message._id == id);
        if (messageIndex === -1) {
            throw new Error(`No se encontró el mensaje con ID ${id}`);
        }
        const updatedMessage = {...messages[messageIndex],...changes,};
        messages[messageIndex] = updatedMessage;
        await messagesModel.updateOne({ _id: id },{ $set: updatedMessage })

        return updatedMessage;
    }

    eliminarMessage = async (id) => {
        const messages = await this.chatRepository.getMessages();
        const index = messages.findIndex((p) => p._id == id);
        if (index === -1) {
            throw new Error(`No se encontró el mensaje con ID ${id}`);
        }
        messages.splice(index, 1);
        await messagesModel.findByIdAndDelete(id)

        return `Se eliminó el mensaje ${id} correctamente`;
    }
}