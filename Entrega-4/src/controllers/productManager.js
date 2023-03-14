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

    getProductById (id){
        const filter =  this.product.filter((product) => {return product.id == id})
        if (filter.length === 0){
            throw new Error ('no se encontro el producto seleccionado!!!!')
        }
        return  filter
    }

    addProduct =(title, description, price, thumbnail , code, stock,category)=>{
        const error = this.chekProduct(code)
        if(error) {
            throw new Error ('che el codigo esta repetido!!!!!!!!');
        } 

        const products ={
            id: this.product.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock ,
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
        if(thumbnail === undefined){
            throw new Error (`debes rellenar la thumbnail del producto ${products.id}`);
        }
        if(stock === undefined){
            throw new Error (`debes rellenar el stock del producto ${products.id}`);
        }
        if(category === undefined){
            throw new Error (`debes rellenar el category del producto ${products.id}`);
        }
        return this.product.push(products)
    }
}
export default ProductManager;
