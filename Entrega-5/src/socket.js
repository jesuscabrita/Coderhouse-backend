import { Server } from "socket.io";
import ProductManager from "./controllers/productManager.js";

const socket = {};
const productManager = new ProductManager();

socket.connect = async(httpServer) => {
    socket.io = new Server(httpServer);

    let { io } = socket;

    io.on("connection",async (socket) => {
        const productos = await productManager.getProducts()
        console.log(`${socket.id} connected`);

        socket.emit('updateProducts', productos);

        socket.on('addProduct', (producto) => {
            productos.push(producto);
            io.emit('updateProducts', productos);
        });

        socket.on('eliminarProducto', (productoId) => {
            const index = productos.findIndex((producto) => producto.id === productoId);
            if (index !== -1) {
                productos.splice(index, 1);
                io.emit('updateProducts', productos);
            }
            io.emit('updateProducts', productos);
        });

        socket.on('editarProducto', (productoId) => {
            const index = productos.findIndex((producto) => producto.id === productoId);
            if (index !== -1) {
                productos.splice(index, 1);
                io.emit('updateProducts', productos);
            }
            io.emit('updateProducts', productos);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
};

export default socket;