import  express from "express";
import CartsManager from "../controllers/cartsManager.js";

const router = express.Router();

const cartManager = new CartsManager();
cartManager.addcart();
cartManager.addcart();
cartManager.addcart();

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = cartManager.getcarts().find((u) => u.id == cid);
    if (!cart) return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    return res.status(200).send({status: 'Succes', message: 'OK', cart});
});

router.post("/", (req, res) => {
    
    try{ 
        const carrito = req.body;

        cartManager.addcart(
            carrito.products,
        );
    return res.status(200).send({ status: 'Succes', message:'Se creo el carritoo correctamente' });
} catch (err) {
    return res
    .status(400)
    .send({ status: "Error", error: err.message });
}
});

router.post("/:cid/product/:pid", (req, res) => {
    try{ 
        const product = req.body
        const productID = Number(req.params.pid)
        const carritoID = req.params.cid 
        product.id = productID
        const indiceCart = cartManager.cart.findIndex((e) => e.id == carritoID)
        const indiceProduct = cartManager.cart[indiceCart].products.findIndex((e) => e.id == productID)

        if(indiceProduct !== -1){
            cartManager.cart[indiceCart].products[indiceProduct].quantity ++
        }else{
            cartManager.cart[indiceCart].products.push(product)
        }

        const resul = cartManager.cart[indiceCart]

    return res.status(200).send({ status: 'Succes', message:'Se creo el producto correctamente', resul });
} catch (err) {
    return res
    .status(400)
    .send({ status: "Error", error: err.message });
}
});

export default router;