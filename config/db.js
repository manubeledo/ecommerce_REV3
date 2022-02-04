// const db = require('./index')
require('dotenv').config();
let mongoose = require('mongoose')

const MONGO_DB = process.env.MONGO_DB_URI;
const DB_NAME = process.env.DB_NAME;
const CONNECT = `${MONGO_DB}`

let connection = null;

(async ()=>{
    try {
        console.log(`Conexion de mongo creada en ${CONNECT}`)
        connection = await mongoose.connect(`${CONNECT}`)
    } catch (error) {
        console.log('error al conectarse a Mongo')
        
    }
})()

const Schema = mongoose.Schema;

const productosSchema = new Schema({
    id_producto: Number(), 
    name: String(),
    description: Number(),
    price:String(),
    thumbnail: String(),
    stock: Number()
})

const carritosSchema = new Schema({
    id: Number(),
    productos_carrito:[]
})

const productosModel = mongoose.model('productos', productosSchema)
const carritosModel = mongoose.model('carritos', carritosSchema)

module.exports = { productosModel, carritosModel }

