class ProductManager {
    constructor(){
        this.product = [];
    }
    
    getProducts =()=>{
        console.log(this.product);
        return this.product;
    }

    chekProduct =(code)=>{
        const  error = this.product.find((pro) => pro.code === code)
        return error;
    }

    getProductById =(id)=>{
        const filter =  this.product.filter((product) => product.id === id)
        if (filter.length === 0){
            console.log('no se encontro el producto seleccionado!!!!');
        }
        console.log(filter);
        return  filter
    }

    addProduct =(title, description, price, thumbnail , code, stock)=>{
        const error = this.chekProduct(code)
        if(error) {
            return console.log('che el codigo esta repetido!!!!!!!!');
        } 

        const products ={
            id: this.product.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }
        if ( title === undefined) {
            return console.log(`debes rellenar el titulo del producto ${products.id}`);
        }
        if(description === undefined){
            return console.log(`debes rellenar la descripcion del producto ${products.id}`);
        }
        if(price === undefined){
            return console.log(`debes rellenar el precio del producto ${products.id}`);
        }
        if(thumbnail === undefined){
            return console.log(`debes rellenar la thumbnail del producto ${products.id}`);
        }
        if(stock === undefined){
            return console.log(`debes rellenar el stock del producto ${products.id}`);
        }
        return this.product.push(products)
    }
}

const productManager = new ProductManager();
productManager.addProduct('arroz','amarillo', 500, null, '12345', 50);
productManager.addProduct('Queso','Verde', null, null, '1234', 41);
productManager.addProduct('sal','verde');
productManager.getProductById()
productManager.getProducts();