import express from "express";
import cartsRouter from "./router/carts.router.js";
import productRouter from "./router/product.router.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import socket from "./socket.js";
import viewsRouter from "./router/views.router.js";
import { MONGODB, PORT } from "./config.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter );
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corre en el puerto ${PORT}`);
});

console.log(`⚛️ Conectando a la base de datos...`);
mongoose.connect(MONGODB);
console.log(`✅ Conectado a la base de datos: ${MONGODB}`);

socket.connect(httpServer)