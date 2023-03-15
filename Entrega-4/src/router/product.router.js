import  express from "express";
import ProductManager from '../controllers/productManager.js'
import { uploader } from "../utils.js";

const router = express.Router();
const productManager = new ProductManager();

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

router.post("/", uploader.single("thumbnail"), async(req, res) => {
    
    try{ 
        const product = req.body;
        const filename = req?.file?.filename;

        // if (!filename) {
        //     return res
        //         .status(400)
        //         .send({ status: "Error", error: "No se envio niguna imagen!!" });
        //     }

        await productManager.addProduct(
            product.title,
            product.description, 
            product.price, 
            filename?  product.thumbnail =  `http://localhost:8080/images/${filename}` : null , 
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

router.put("/:id",uploader.single("thumbnail"),async (req, res) => {
    const productId = Number(req.params.id);
    const changes = req.body;
    const filename = req?.file?.filename;
    const productos = await productManager.getProducts()
    const productIndex = productos.findIndex((u) => u.id == productId);
    changes.id = productId
    changes.thumbnail = [`http://localhost:8080/images/${filename}`]

    if (!filename) {
        return res
            .status(400)
            .send({ status: "Error", error: "No se envio niguna imagen!!" });
        }

    if (productIndex === -1) {
        return res.status(404).send({ status: "Error", message: "Producto no encontrado!!" });
    }
    await productManager.editarProducto(productIndex, changes)

    return res
        .status(200)
        .send({ status: "OK", message: `Producto se edito correctamente`, changes });
});

router.delete("/:id",async (req, res) => {
    const productId = req.params.id;
    const productos = await productManager.getProducts()
    const productIndex = productos.findIndex((u) => u.id == productId);

    if (productIndex === -1) {
        return res
        .status(404)
        .send({ status: "Error", message: `el producto ${productId} no existe` });
    }
    await productManager.eliminarProducto(productIndex)
    
    return res
        .status(200)
        .send({ status: "Sucess", message: `Producto ${productId} fue eliminado con exito!!` });
});

export default router;