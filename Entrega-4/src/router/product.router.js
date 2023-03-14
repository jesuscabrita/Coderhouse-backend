import  express from "express";
import ProductManager from '../controllers/productManager.js'
import { uploader } from "../utils.js";

const router = express.Router();

const productManager = new ProductManager();
productManager.addProduct('arroz','amarillo', 500, null, '12345', 50,'comida');
productManager.addProduct('Queso','Verde', null, null, '12344',0, 'comida');
productManager.addProduct('sal','verde', 500, null, '123453', 50,'comida');
productManager.addProduct('Pera','amarillo', 500, null, '123452', 50, 'comida');
productManager.addProduct('Manzana','Verde', null, null, '123433', 41, 'comida');
productManager.addProduct('Galletitas','verde', 500, null, '1234544', 1, 'comida');

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const productos = await productManager.getProducts()

    if (!limit){ 
        return res.send({ productos });
    }
    const productosFiltrados = productos.slice(0 , limit)
    return res.send({ productosFiltrados });
});

router.get("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const producto = await productManager.getProductById(pid)
    return res.send({producto});
});

router.post("/", uploader.single("thumbnail"), (req, res) => {
    
    try{ 
        const product = req.body;
        const filename = req?.file?.filename;

        if (!filename) {
            return res
                .status(400)
                .send({ status: "Error", error: "No se envio niguna imagen!!" });
            }

        productManager.addProduct(
            product.title,
            product.description, 
            product.price, 
            product.thumbnail =  `http://localhost:8080/images/${filename}` , 
            product.code, 
            product.stock,
            product.category
        );
    return res.status(200).send({ status: 'Succes', message:'Se creo el producto correctamente', product });
} catch (err) {
    return res
    .status(400)
    .send({ status: "Error", error: err.message });
}
});

router.put("/:id",uploader.single("thumbnail"), (req, res) => {
    const productId = Number(req.params.id);
    const changes = req.body;
    const filename = req?.file?.filename;
    const productIndex =  productManager.getProducts().findIndex((u) => u.id == productId);
    changes.id = productId
    changes.thumbnail = `http://localhost:8080/images/${filename}`

    if (!filename) {
        return res
            .status(400)
            .send({ status: "Error", error: "No se envio niguna imagen!!" });
        }

    if (productIndex === -1) {
        return res.status(404).send({ status: "Error", message: "Producto no encontrado!!" });
    }

    productManager.product[productIndex] = changes

    return res
        .status(200)
        .send({ status: "OK", message: `Producto se edito correctamente`, changes });
});

router.delete("/:id", (req, res) => {
    const productId = req.params.id;
    const productIndex = productManager.getProducts().findIndex((u) => u.id == productId);

    if (productIndex === -1) {
        return res
        .status(404)
        .send({ status: "Error", message: `el producto ${productId} no existe` });
    }

    productManager.getProducts().splice(productIndex, 1);
    return res
        .status(200)
        .send({ status: "Sucess", message: `Producto ${productId} fue eliminado con exito!!` });
});

export default router;