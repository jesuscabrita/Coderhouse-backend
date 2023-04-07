import { Server } from "socket.io";
import { ProductsDataBase } from "./controllers/products.js";
import { ChatDataBase } from "./controllers/chat.js";

const socket = {};
let messages = [];
const messageQueue = [];

const chatDB = new ChatDataBase();

socket.connect = function (httpServer) {
    socket.io = new Server(httpServer);
    let { io } = socket;

    io.on("connection", async(socket) => {
        console.log(`${socket.id} connected`);
        socket.broadcast.emit("userConnected", { user: socket.id, message: `${socket.id} se ha conectado`});

        // Obtener todos los mensajes de la base de datos al conectarse un nuevo usuario
        let messages = await chatDB.getMessages();
        socket.emit("messageLogs", messages);

        socket.on("message", async (data) => {
            // Agregar el nuevo mensaje a la cola de mensajes y la base de datos
            messageQueue.push(data);
            await chatDB.addMessage(data.message, data.user);

            // Enviar el mensaje solo al cliente que lo ha enviado
            socket.emit("messageSent", { user: data.user, message: data.message });

            // Enviar el mensaje a todos los clientes conectados (incluyendo al que lo ha enviado)
            io.emit("messageLogs", messageQueue);
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
