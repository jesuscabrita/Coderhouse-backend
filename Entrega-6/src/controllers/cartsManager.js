import fs from "fs";
import __dirname from "../utils.js";
class CartsManager {
    constructor(){
        this.cartJSON = __dirname + "/files/Carts.json"
        this.productJSON = __dirname + "/files/Carts.json"
    }
    
    getcarts = async()=>{
        if (fs.existsSync(this.cartJSON)) {
            const data = await fs.promises.readFile(this.cartJSON, "utf-8");
            const result = JSON.parse(data);
            return result;
        } else {
            return [];
        }
    }
    getProduct = async ()=>{
        if (fs.existsSync(this.productJSON)) {
            const data = await fs.promises.readFile(this.productJSON, "utf-8");
            const result = JSON.parse(data);
            return result;
        } else {
            return [];
        }
    }

    getcartById = async(id) =>{
        const carritos = await this.getcarts()
        const filter =  carritos.filter((cart) => {return cart.id == id})
        if (filter.length === 0){
            throw new Error ('no se encontro el carrito seleccionado!!!!')
        }
        return  filter
    }

    getProductById = async(id) =>{
        const productos = await this.getProduct()
        const filter =  productos.filter((product) => {return product.id == id})
        if (filter.length === 0){
            throw new Error ('no se encontro el producto seleccionado!!!!')
        }
        return  filter
    }

    addcart = async(cart)=>{
        const carritos = await this.getcarts()
        const carts ={
            id: carritos.length + 1,
            products: cart = [],
        }
        carritos?.push(carts)
        await fs.promises.writeFile(
            this.cartJSON,
            JSON.stringify(carritos, null, "\t")
            );

            return carts; 
    }

}
export default CartsManager;