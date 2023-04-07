import { Server } from "socket.io";
import { ProductsDataBase } from "./controllers/products.js";

const socket = {};
let messages = [];

socket.connect = function (httpServer) {
    socket.io = new Server(httpServer);
    let { io } = socket;

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`);
        socket.broadcast.emit("userConnected", { user: socket.id, message: `${socket.id} se ha conectado`});

        socket.on("message", (data) => {
            messages.push(data);
            io.emit("messageLogs", messages);
            socket.broadcast.emit("messageSent", { user: data.user, message: data.message });
        });

        socket.on("disconnect", (data) => {
            console.log(`${socket.id} disconnected`);
            socket.broadcast.emit("userDisconnected", { user: socket.id, message: `${socket.id} se ha desconectado` });
        });
    });
};

// const socket = {};
// const productDataBase = new ProductsDataBase();

// socket.connect = async(httpServer) => {
//     socket.io = new Server(httpServer);

//     let { io } = socket;

//     io.on("connection",async (socket) => {
//         const productos = await productDataBase.getProducts()
//         console.log(`${socket.id} connected`);

//         socket.emit('newProduct', productos);

//         socket.on('addProduct', (producto) => {
//             productos.push(producto);
//             io.emit('newProduct', productos);
//         });

//         socket.on('eliminarProducto', (productoId) => {
//             const index = productos.findIndex((producto) => producto._id == productoId);
//             if (index !== -1) {
//                 productos.splice(index, 1);
//                 io.emit('newProduct', productos);
//             }
//             io.emit('newProduct', productos);
//         });

//         socket.on('editarProducto', (productoId) => {
//             const index = productos.findIndex((producto) => producto._id == productoId);
//             if (index !== -1) {
//                 productos.splice(index, 1);
//                 io.emit('newProduct', productos);
//             }
//             io.emit('newProduct', productos);
//         });

//         socket.on('disconnect', () => {
//             console.log('Cliente desconectado');
//         });
//     });
// };

export default socket;
