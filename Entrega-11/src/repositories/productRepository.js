import { productsModel } from "../dao/models/products.js";

export class ProductsRepository {
    static instance = null;

    static getInstance() {
        if (!ProductsRepository.instance) {
            ProductsRepository.instance = new ProductsRepository();
        }
        return ProductsRepository.instance;
    }
    constructor() { }

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
            const data = await productsModel.paginate(filter, options);
            const products = data.docs.map((product) => product.toObject());
            if (products.length === 0) {
                throw new Error("No se encontró el producto que buscas.");
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
            const producto = await productsModel.findById(id);
            if (!producto) {
                throw new Error('No se encontró el producto seleccionado');
            }
            return producto.toObject();
        } catch (error) {
            throw new Error("Error al obtener el producto");
        }
    };
}