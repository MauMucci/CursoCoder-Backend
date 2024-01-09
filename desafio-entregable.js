const fs = require('fs'); //FUNCIONA ELIMINANDO TYPE: MODULE DEL PACAKAGE.JSON

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title,
            this.description = description,
            this.price = price,
            this.thumbnail = thumbnail,
            this.code = code,
            this.stock = stock,
            this.id = null            
    }
}

let idIncrementado = 0;

class ProductManager {

    constructor() {
        this.products = []
        this.filePath = './products.json';
    }

    checkCode(product) {
        return this.products.some(p => p.code === product.code)
    }

    async saveProductsOnFile(){
        try{
            await fs.promises.writeFile(this.filePath,JSON.stringify(this.products,null,2)) //agrega una sangria de 2 estados
            console.log("Productos guardados correctamente en el archivo");
        }
        catch (error){
            console.error('Error escribiendo en el archivo:', error);
        }
    }

    async loadProductsFromFile() {
        try {
            const fileContent = await fs.promises.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(fileContent);
            console.log("Productos cargados correctamente en el archivo");
        } catch (error) {
            console.error("Error cargando productos desde el archivo ", error);
        }
    }

    async addProductsAsync(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.log("datos incompletos")
            return null
        }

        if (this.checkCode(product)) {
            console.log(`Código [${product.code}] ya usado`);
        }
        else {
            idIncrementado++;
            product.id = idIncrementado
            this.products.push(product)
            console.log(`Producto agregado con id ${product.id}`);
            //await fs.promises.writeFile("./products.txt","hola desde js")            
        }
        await this.saveProductsOnFile();
    }

    async getProductsAsync() {
      await this.loadProductsFromFile();
      console.log("++++ Productos ++++")
      console.log(this.products)

}

    async getProductsByIdAsync(id) {

        await this.loadProductsFromFile();
        const product = this.products.find(product => product.id === id)
        if(!product){
            console.log(`producto con ID ${id} no encontrado`)
        } else{
            console.log(`Producto encontrado con el id: ${id}`)
            console.log(product)
        }
}

async updateProduct(id, updatedFields) {
    // Cargar productos desde el archivo antes de actualizar
    await this.loadProductsFromFile();

    //Encuentro el indice del producto con el ID dado por parametro
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
        console.log(`Producto con ID ${id} no encontrado. No se actualizará.`);
    } else {
        // Mantener el ID al actualizar
        updatedFields.id = id;

        // Actualizar solo los campos proporcionados
        this.products[index] = {
            ...this.products[index],
            ...updatedFields
        };

        console.log(`Producto con ID ${id} actualizado correctamente.`);
    }
    return this.saveProductsOnFile();
}

async deleteProduct(id) {
    // Cargar productos desde el archivo antes de eliminar
    await this.loadProductsFromFile();

    // Encontrar el índice del producto con el ID proporcionado
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
        console.log(`Producto con ID ${id} no encontrado. No se eliminará.`);
    } else {
        // Eliminar el producto del array
        this.products.splice(index, 1);
        console.log(`Producto con ID ${id} eliminado correctamente.`);
    }

    // Guardar la lista actualizada en el archivo y devolver la promesa
    return this.saveProductsOnFile();
}

}


let pm = new ProductManager()

const prod1 = new Product(
    "producto 1", 
    "producto 1",
    100,
    "sin ruta",
    "aaaa",
    10
);
const prod2 = new Product(
    "producto 2",
    "producto 2",
    200,
    "sin ruta",
    "bbbb",
    20);

//pm.addProductsAsync(prod1)
//pm.addProductsAsync(prod2)

//pm.getProductsAsync()
//pm.getProductsByIdAsync(2);
//pm.updateProduct(1, { price: 150, stock: 15 });
pm.deleteProduct(2);