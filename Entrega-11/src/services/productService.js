import { productsModel } from "../dao/models/products.js";
import { ProductsRepository } from "../repositories/productRepository.js";

export class ProductsService {
    static instance = null;

    static getInstance() {
        if (!ProductsService.instance) {
            ProductsService.instance = new ProductsService();
        }
        return ProductsService.instance;
    }
    constructor() {
        this.productsRepository = ProductsRepository.getInstance()
    }

    checkProductCode = async (code) => {
        const product = await productsModel.findOne({ code });
        return !!product;
    }

    validateProductData(title, description, price, stock, category) {
        if (!title) {
            throw new Error("El título del producto es requerido");
        }
        if (!description) {
            throw new Error("La descripción del producto es requerida");
        }
        if (!price || isNaN(price)) {
            throw new Error("El precio del producto es obligatorio y debe ser un número.");
        }
        if (!stock || isNaN(stock) || parseInt(stock) < 0) {
            throw new Error("El stock del producto es obligatorio y debe ser un número.");
        }
        if (!category) {
            throw new Error("La categoría del producto es requerida");
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
        this.validateProductData(title, description, price, stock, category);
        const { payload } = await this.productsRepository.getProducts()
        const codigo = await this.checkProductCode(code)
        if (codigo) {
            throw new Error(`El código "${code}" ya existe`);
        }
        const newProduct = {
            title: title.trim(),
            description: description.trim(),
            price: parseFloat(price),
            thumbnail: thumbnail || [],
            code: code.trim(),
            stock: parseInt(stock),
            status: stock < 1 ? false : true,
            category: category.trim(),
        }
        payload?.push(newProduct)
        await productsModel.create(newProduct)

        return newProduct;
    }

    editarProducto = async (id, changes) => {
        const { payload } = await this.productsRepository.getProducts();
        const productIndex = payload.findIndex((product) => product._id == id);
        if (productIndex === -1) {
            throw new Error(`No se encontró el producto con ID ${id}`);
        }

        const updatedProduct = {
            ...productos[productIndex],
            ...changes,
            price: parseFloat(changes.price),
            stock: parseInt(changes.stock),
            status: changes.stock < 1 ? false : true,
        };
        productos[productIndex] = updatedProduct;
        await productsModel.updateOne({ _id: id }, { $set: updatedProduct })

        return updatedProduct;
    }

    eliminarProducto = async (id) => {
        const { payload } = await this.productsRepository.getProducts();
        const index = payload.findIndex((p) => p._id == id);
        if (index === -1) {
            throw new Error(`No se encontró el producto con ID ${id}`);
        }
        productos.splice(index, 1);
        await productsModel.findByIdAndDelete(id)

        return `Se eliminó el producto ${id} correctamente`;
    }
}