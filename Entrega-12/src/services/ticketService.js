import { ProductsRepository } from "../repositories/productRepository.js";
import { TicketRepository } from "../repositories/ticketRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

export class TicketService {
    static instance = null;

    static getInstance() {
        if (!TicketService.instance) {
            TicketService.instance = new TicketService();
        }
        return TicketService.instance;
    }
    constructor() {
        this.ticketRepository = TicketRepository.getInstance();
        this.userRepository = UserRepository.getInstance();
        this.productsRepository = ProductsRepository.getInstance();
    }

    getTicket = async () => {
        const data = await this.ticketRepository.modelGetTicket();
        const ticket = data.map((ticket) => ticket.toObject());
        return ticket;
    }

    getUser = async () => {
        const data = await this.userRepository.modelGetUser();
        const users = data.map((user) => user.toObject());
        return users;
    }

    getTicketById = async (tid) => {
        const tickets = await this.getTicket();
        const ticket = tickets.find((ticket) => ticket.userID == tid);
        if (!ticket) {
            throw new Error('No se encontró el ticket seleccionado');
        }
        return ticket;
    }

    getUserById = async (uid) => {
        const users = await this.getUser();
        const user = users.find((u) => u._id == uid);
        return user;
    };

    getProductById = async (pid) => {
        try {
            const producto = await this.productsRepository.modelProductById(pid);
            if (!producto) {
                throw new Error('No se encontró el producto seleccionado');
            }
            return producto.toObject();
        } catch (error) {
            throw new Error("Error al obtener el producto");
        }
    };

    generateUniqueId = async () => {
        const uniqueId = Math.floor(100000 + Math.random() * 900000);
        return uniqueId;
    };

    generateTicketCode = async () => {
        const uniqueId = await this.generateUniqueId();
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[-:.T]/g, '').slice(0, 14);
        const ticketCode = `ORDEN-${formattedDate}-${uniqueId}`;
        return ticketCode;
    };

    calculateTotalAmount = async (products) => {
        let totalAmount = 0;
        for (const product of products) {
            totalAmount += product.quantity * product.product.price;
        }
        return totalAmount.toFixed(2);
    };

    enviarCorreo = async (ticket) => {
        const transporter = this.ticketRepository.createTransportCorreo();
        const correo = this.ticketRepository.correoTextEnCola(ticket);
        try {
            const info = await this.ticketRepository.enviarCorreo(transporter,correo);
            console.log(`Correo electrónico enviado: ${info.messageId}`);
        } catch (error) {
            console.error(error);
        }
    };

    createTicket = async (userId) => {
        try {
            const user = await this.getUserById(userId);
            const cartProducts = user.cart.products;
            const cartCopy = { _id: user.cart._id, products: [] };
            let ticketUserId = Math.floor(100000 + Math.random() * 900000);

            const newTicket = {
                code: await this.generateTicketCode(),
                purcharse_datetime: new Date(),
                amount: await this.calculateTotalAmount(cartProducts),
                purcharse: user.email,
                products: cartProducts.map((product) => ({
                    ...product
                })),
                userID: ticketUserId,
            };

            for (const product of cartProducts) {
                const productId = product.product._id;
                const quantity = product.quantity;
                const productInDB = await this.productsRepository.modelProductById(productId);

                if (!productInDB) {
                    throw new Error(`No se encontró el producto con ID: ${productId}`);
                }
                if (productInDB.stock < quantity) {
                    throw new Error(`No hay suficiente stock para el producto con ID: ${productId}`);
                }
                productInDB.stock -= quantity;
                await this.ticketRepository.modelUpdateProduct(productInDB);
            }
            await this.enviarCorreo(newTicket);
            const createdTicket = await this.ticketRepository.modelCreateTicket(newTicket);
            user.cart = cartCopy;
            await this.ticketRepository.modelUserUpdateOne({ _id: user._id }, { cart: user.cart }); // Guardar los cambios en el usuario en la base de datos

            return createdTicket;
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            throw error;
        }
    };
}