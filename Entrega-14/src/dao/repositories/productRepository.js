import { productsModel } from "../models/products.js";

export class ProductsRepository {
    static instance = null;

    static getInstance() {
        if (!ProductsRepository.instance) {
            ProductsRepository.instance = new ProductsRepository();
        }
        return ProductsRepository.instance;
    }
    constructor() { }

    modelProductPaginate = (filter, options) => {
        return productsModel.paginate(filter, options)
    }

    modelProductById = (id) => {
        return productsModel.findById(id)
    }

    modelCheckProduct = (code) => {
        return productsModel.findOne({ code })
    }

    modelProductCreate = (newProduct) => {
        return productsModel.create(newProduct)
    }

    modelProductEdit = (id, updatedProduct ) => {
        return productsModel.updateOne({ _id: id }, { $set: updatedProduct })
    }

    modelProductDelete = (id) => {
        return productsModel.findByIdAndDelete(id)
    }
}