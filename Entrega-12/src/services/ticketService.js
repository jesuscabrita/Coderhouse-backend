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
        const ticket = tickets.find((ticket) => ticket._id == tid);
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
        // Implementa tu lógica para generar un identificador único aquí
        // Puede ser un UUID, un hash único, un contador en la base de datos, etc.
        // En este ejemplo, utilizaremos una función sencilla para generar un número aleatorio de 6 dígitos
        const uniqueId = Math.floor(100000 + Math.random() * 900000);
        return uniqueId;
    }

    // Función para generar un código único para el ticket
    generateTicketCode= async () => {
    // Generar un identificador único
    const uniqueId = await this.generateUniqueId();

    // Obtener la fecha actual
    const currentDate = new Date();

    // Formatear la fecha actual como YYYYMMDDHHMMSS
    const formattedDate = currentDate.toISOString().replace(/[-:.T]/g, '').slice(0, 14);

    // Crear el código del ticket utilizando el identificador y la fecha
    const ticketCode = `TICKET-${formattedDate}-${uniqueId}`;

    return ticketCode;
    }

  // Función para calcular el monto total del ticket
    calculateTotalAmount= async (products) => {
    let totalAmount = 0;
    for (const product of products) {
      totalAmount += product.quantity * product.product.price;
    }
    return totalAmount;
    }

    createTicket = async (userId) => {
        try {
            // Obtener los productos del carrito del usuario
            const user = await this.getUserById(userId);
            const cartProducts = user.cart.products;
    
            // Crear un nuevo objeto de ticket
            const newTicket = {
                code: await this.generateTicketCode(), // Genera un código único para el ticket
                purcharse_datetime: new Date(),
                amount: await this.calculateTotalAmount(cartProducts),
                purcharse: user.email,
                products: cartProducts.map((product) => product.product), // Mapear los productos completos
                userID: user._id,
            };
    
            // Restar la cantidad de productos vendidos al stock en la base de datos
            for (const product of cartProducts) {
                const productId = product.product._id;
                const quantity = product.quantity;
              
                // Obtener el producto de la base de datos
                const productInDB = await this.productsRepository.modelProductById(productId);
              
                // Verificar si el producto existe
                if (!productInDB) {
                  throw new Error(`No se encontró el producto con ID: ${productId}`);
                }
              
                // Verificar si hay suficiente stock para restar
                if (productInDB.stock < quantity) {
                  throw new Error(`No hay suficiente stock para el producto con ID: ${productId}`);
                }
              
                // Restar la cantidad al stock del producto
                productInDB.stock -= quantity;
              
                // Actualizar el producto en la base de datos
                await this.ticketRepository.modelUpdateProduct(productInDB);
              }
    
            // Guardar el nuevo ticket en la base de datos
            const createdTicket = await this.ticketRepository.modelCreateTicket(newTicket);
    
            // Limpiar el carrito del usuario
            user.cart.products = [];
            await this.ticketRepository.modelUserUpdateOne({ _id: user._id }, { cart: { products: [] } }); // Guardar los cambios en el usuario en la base de datos
    
            return createdTicket;
        } catch (error) {
            // Manejo de errores
            console.error("Error al crear el ticket:", error);
            throw error;
        }
    };
}