import  express from "express";
import CartsManager from "../controllers/cartsManager.js";
import fs from "fs";

const router = express.Router();

const cartManager = new CartsManager();

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const carritos = await cartManager.getcarts()
    const cart = carritos.find((u) => u.id == cid);
    if (!cart) return res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    return res.status(200).send({status: 'Succes', message: 'OK', cart});
});

router.post("/", async (req, res) => {
    try{ 
        const carrito = req.body;

    await cartManager.addcart(
            carrito.products,
        );
    return res.status(200).send({ status: 'Succes', message:'Se creo el carritoo correctamente' });
} catch (err) {
    return res
    .status(400)
    .send({ status: "Error", error: err.message });
}
});

router.post("/:cid/product/:pid", async (req, res) => {
    try{ 
        const product = req.body
        const productID = Number(req.params.pid)
        const carritoID = Number(req.params.cid) 
        const carritos = await cartManager.getcarts()
        product.id = productID
        product.quantity

        const indiceCart = carritos.findIndex((e) => e.id == carritoID)
        const indiceProduct = carritos[indiceCart].products.findIndex((e) => e.id == productID)

        if(indiceProduct !== -1){
            carritos[indiceCart].products[indiceProduct].quantity ++
        }else{
            carritos[indiceCart].products.push(product)
        }

        await fs.promises.writeFile(
            cartManager.cartJSON,
            JSON.stringify(carritos, null, "\t")
            );

        const resul = carritos[indiceCart]

    return res.status(200).send({ status: 'Succes', message:'Se creo el producto correctamente', resul });
} catch (err) {
    return res
    .status(400)
    .send({ status: "Error", error: err.message });
}
});

export default router;