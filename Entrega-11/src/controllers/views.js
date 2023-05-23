import { ChatRepository } from "../repositories/chatRepository.js";
import { ProductsRepository } from "../repositories/productRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

const productsRepository = ProductsRepository.getInstance();
const chatRepository = ChatRepository.getInstance();
const userRepository = UserRepository.getInstance();

export const getLogin = async (req, res) => {
    res.render("login", { title: "Login", user: req.session.user });
};

export const getRegister = async (req, res) => {
    res.render("register", { title: "Register", user: req.session.user });
};

export const getProfile = async (req, res) => {
    res.render("profile", { user: req.session.user });
};

export const getlogout = async (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

export const getProduct = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const {
        payload: products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
    } = await productsRepository.getProducts(limit, page, query);

    return res.render("products", {
        products: products,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        user: req.session.user,
    });
};

export const getProductById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const producto = await productsRepository.getProductById(pid);
        return res.render("product", { title: "Product", producto: producto, user: req.session.user });
    } catch (error) {
        return res.status(404).send({ status: "Error", error: "No se encontró el producto seleccionado" });
    }
};

export const getCartById = async (req, res) => {
    const cid = req.params.cid;
    const cart = await userRepository.getUserCartById(cid);
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.render("cart", { title: "Cart", cart: cart, user: req.session.user });
    }
};

export const getAdmin = async (req, res) => {
    const cart = await userRepository.getUser()
    if (!cart) {
        return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    } else {
        return res.render("admin", { title: "admin", cart: cart, user: req.session.user });
    }
};

export const getRealtimeproducts = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const productos = await productsRepository.getProducts(limit, page, query);
    res.render("realtimeproducts", { title: "realtimeproducts", productos: productos, user: req.session.user });
};

export const getHomeProduct = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = req.query.limit;
    const query = req.query;
    const productos = await productsRepository.getProducts(limit, page, query);
    res.render("home", { title: "home", productos: productos, user: req.session.user });
};

export const getChat = async (req, res) => {
    const messages = await chatRepository.getMessages();
    res.render("chat", { title: "chat", messages: messages, user: req.session.user });
};