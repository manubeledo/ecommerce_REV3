// const db = require('./index')
require('dotenv').config();
let mongoose = require('mongoose');
const logger = require('../utils/logger')


const MONGO_DB = process.env.MONGO_DB_URI;
const CONNECT = `${MONGO_DB}`

let connection = null;

(async ()=>{
    try {
        logger.getLogger('consola').info(`Conexion de mongo creada en ${CONNECT}`)
        connection = await mongoose.connect(`${CONNECT}`)
    } catch (error) {
        logger.getLogger('outerror').error('error al conectarse a Mongo')
        
    }
})()

const Schema = mongoose.Schema;

const productosSchema = new Schema({
    id_producto: { 
        type: Number, 
        required: true,
        unique: true
    },
    name: String,
    description: String,
    price:Number,
    thumbnail: String,
    stock: Number
})

const carritosSchema = new Schema({
    id: Number,
    productos_carrito:[]
})

const signUpSchema = new Schema({
    username: String,
    userage: Number,
    useradress: String,
    userintcod: Number,
    userareacod: Number,
    useremail: String,
    userpass: String
})

const productosModel = mongoose.model('productos', productosSchema)
const carritosModel = mongoose.model('carritos', carritosSchema)
const User = mongoose.model('User', signUpSchema)

let appConfig = {
    port: process.env.PORT
}

module.exports = { productosModel, carritosModel, User, appConfig }

