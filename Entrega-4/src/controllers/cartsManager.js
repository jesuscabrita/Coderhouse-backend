class CartsManager {
    constructor(){
        this.cart = [];
        this.product = [];
    }
    
    getcarts =()=>{
        console.log(this.cart);
        return this.cart;
    }
    getProduct =()=>{
        console.log(this.product);
        return this.product;
    }

    getcartById (id){
        const filter =  this.cart.filter((cart) => {return cart.id == id})
        if (filter.length === 0){
            throw new Error ('no se encontro el carrito seleccionado!!!!')
        }
        return  filter
    }

    getProductById (id){
        const filter =  this.product.filter((product) => {return product.id == id})
        if (filter.length === 0){
            throw new Error ('no se encontro el producto seleccionado!!!!')
        }
        return  filter
    }

    addcart =(products)=>{
        const carts ={
            id: this.cart.length + 1,
            products: products = [],
        }
        return this.cart.push(carts)
    }

    addproduct =(quantity, idProduct)=>{
        const producto = this.cart[idProduct]

        const product ={
            id: this.product.length + 1 ,
            quantity,
        }

        if ( quantity === undefined) {
            throw new Error (`debes rellenar el quantity del producto ${product.id}`) 
        }
        return producto.push(product)
    }
}
export default CartsManager;
