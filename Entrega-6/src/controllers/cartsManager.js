import fs from "fs";
import __dirname from "../utils.js";

class ProductManager {
    constructor(){
        this.productJSON = __dirname + "/files/Products.json"
    }
    
    getProducts = async()=>{
        if (fs.existsSync(this.productJSON)) {
            const data = await fs.promises.readFile(this.productJSON, "utf-8");
            const result = JSON.parse(data);
            return result;
        } else {
            return [];
        }
    }

    chekProduct = async (code)=>{
        const productos = await this.getProducts()
        const  error = productos.find((pro) => pro.code === code)
        return error;
    }

    getProductById = async (id) =>{
        const productos = await this.getProducts()
        const filter =  productos.filter((product) => {return product.id == id})
        if (filter.length === 0){
            throw new Error ('no se encontro el producto seleccionado!!!!')
        }
        return  filter
    }

    addProduct = async (title, description, price, thumbnail , code, stock,category)=>{
        const productos = await this.getProducts()
        const error = await this.chekProduct(code)
        if(error) {
            throw new Error ('che el codigo esta repetido!!!!!!!!');
        } 

        const products ={
            id: productos.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status : stock < 1 ? false : true ,
            category : category,
        }
        if ( title === undefined) {
            throw new Error (`debes rellenar el titulo del producto ${products.id}`) 
        }
        if(description === undefined){
            throw new Error (`debes rellenar la descripcion del producto ${products.id}`);
        }
        if(price === undefined){
            throw new Error (`debes rellenar el precio del producto ${products.id}`);
        }
        // if(thumbnail === undefined){
        //     throw new Error (`debes rellenar la thumbnail del producto ${products.id}`);
        // }
        if(stock === undefined){
            throw new Error (`debes rellenar el stock del producto ${products.id}`);
        }
        if(category === undefined){
            throw new Error (`debes rellenar el category del producto ${products.id}`);
        }
        productos?.push(products)
        await fs.promises.writeFile(
            this.productJSON,
            JSON.stringify(productos, null, "\t")
            );
            return products; 
    }

    editarProducto= async(id, changes)=>{
        const productos = await this.getProducts()
        productos[id] = changes
        await fs.promises.writeFile(
            this.productJSON,
            JSON.stringify(productos, null, "\t")
            );
            return productos[id];
    }

    eliminarProducto= async(id)=>{
        const productos = await this.getProducts()
        productos.splice(id, 1);
        await fs.promises.writeFile(
            this.productJSON,
            JSON.stringify(productos, null, "\t")
            );
            return `Se elimino el producto ${id} correctamente`;
    }
}
export default ProductManager;