import express from "express";
import cartsRouter from "./router/carts.router.js";
import productRouter from "./router/product.router.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(`${__dirname}/public`));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter );

app.listen(8080, () => {
    console.log("Servidor corre en el puerto 8080");
});
