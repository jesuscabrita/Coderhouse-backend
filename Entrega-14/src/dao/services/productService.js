import { CustomError } from "../../error/CustomError.js";
import { ProductErrors } from "../../error/diccionario.error.js";
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

    getProducts = async (limit, page, query) => {
        try {
            const options = {
                limit: limit || 10,
                page: page || 1,
                sort: {}
            };
            const filter = {};
            if (query && query.category) {
                filter.category = query.category;
            }
            if (query && query.status) {
                filter.status = query.status;
            }
            if (query && query.sort) {
                if (query.sort === "asc") {
                    options.sort = { price: 1 };
                } else if (query.sort === "desc") {
                    options.sort = { price: -1 };
                }
            }
            const data = await this.productsRepository.modelProductPaginate(filter, options);
            const products = data.docs.map((product) => product.toObject());
            if (products.length === 0) {
                const productoError = ProductErrors().PRODUCTO_BY_ID_ERROR;
                const errorProducto = CustomError.generateCustomError(
                    productoError.name,
                    productoError.message,
                    productoError.cause
                );
                throw new Error(errorProducto.message);
            }

            const totalPages = data.totalPages;
            const prevPage = data.prevPage;
            const nextPage = data.nextPage;
            const currentPage = data.page;
            const hasPrevPage = data.hasPrevPage;
            const hasNextPage = data.hasNextPage;
            const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
            const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;

            const response = {
                status: "success",
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            };
            return response;
        } catch (error) {

            throw new Error("Error al obtener los productos");
        }
    };

    getProductById = async (id) => {
        try {
            const producto = await this.productsRepository.modelProductById(id);
            if (!producto) {
                const productoError = ProductErrors().PRODUCTO_BY_ID_ERROR;
                const errorProducto = CustomError.generateCustomError(
                    productoError.name,
                    productoError.message,
                    productoError.cause
                );
                throw new Error(errorProducto.message);
            }
            return producto.toObject();
        } catch (error) {
            const productoError = ProductErrors().PRODUCTO_SERVER_ERROR;
                const errorProducto = CustomError.generateCustomError(
                    productoError.name,
                    productoError.message,
                    productoError.cause
                );
            throw new Error(errorProducto.message);
        }
    };

    checkProductCode = async (code) => {
        const product = await this.productsRepository.modelCheckProduct(code);
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
        const { payload } = await this.getProducts();
        const codigo = await this.checkProductCode(code);
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
        await this.productsRepository.modelProductCreate(newProduct)

        return newProduct;
    }

    editarProducto = async (id, changes) => {
        const { payload } = await this.getProducts();
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
        await this.productsRepository.modelProductEdit(
            id,
            updatedProduct
            )

        return updatedProduct;
    }

    eliminarProducto = async (id) => {
        const { payload } = await this.getProducts();
        const index = payload.find((p) => p._id == id);
        if (index === -1) {
            throw new Error(`No se encontró el producto con ID ${id}`);
        }
        payload.splice(index, 1);
        await this.productsRepository.modelProductDelete(id)

        return `Se eliminó el producto ${id} correctamente`;
    }
}