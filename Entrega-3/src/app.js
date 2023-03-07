const express = require("express");
const ProductManager = require('./productManager')

const productManager = new ProductManager();
productManager.addProduct('arroz','amarillo', 500, null, '12345', 50);
productManager.addProduct('Queso','Verde', null, null, '12344', 41);
productManager.addProduct('sal','verde', 500, null, '123453', 50);
productManager.addProduct('Pera','amarillo', 500, null, '123452', 50);
productManager.addProduct('Manzana','Verde', null, null, '123433', 41);
productManager.addProduct('Galletitas','verde', 500, null, '1234544', 50);

const app = express();

app.get("/products", async (req, res) => {
    const limit = req.query.limit;
    const productos = await productManager.getProducts()

    if (!limit){ 
        return res.send({ productos });
    }
    let productosFiltrados = productos.slice(0 , limit)
    return res.send({ productosFiltrados });
});

app.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    const producto = await productManager.getProductById(pid)
    return res.send({producto});
});

app.listen(8080, () => {
    console.log("Servidor corre en el puerto 8080");
});