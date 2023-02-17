class ProductManager {
    constructor(){
        this.product = [];
    }
    
    getProducts =()=>{
        console.log(this.product);
        return;
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
        return  console.log(filter);
    }

    addProduct =(title, description, price, thumbnail , code, stock)=>{
        const error = this.chekProduct(code)
        if(error) {
            return console.log('che el codigo esta repetido!!!!!!');
        }

        const products ={
            id: this.product.length + 1,
            title,
            description,
            price : price ?? 200,
            thumbnail : thumbnail ?? 'Sin imagen',
            code : code ?? 'abc123',
            stock : stock ?? 25,
        }
        this.product.push(products)
    }
}

const productManager = new ProductManager();
productManager.addProduct('arroz','amarillo', 500, null, '12345', 50);
productManager.addProduct('Queso','Verde', null, null, '1234', 41);
productManager.getProductById()
// productManager.getProducts();