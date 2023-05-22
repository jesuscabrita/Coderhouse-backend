import cartsRouter from "./carts.router.js";
import chatRouter from "./chat.router.js";
import productRouter from "./product.router.js";
import sessionsRouter from "./sessionsrouter.js";
import viewsRouter from "./views.router.js";

export const  plugin_Rutas = (app) => {
    app.use("/api/products",productRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/chat", chatRouter)
    app.use("/api/sessions", sessionsRouter)
    app.use("/", viewsRouter);
}