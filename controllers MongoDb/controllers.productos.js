const { productosModel : db } = require('../config/db')

const write = async (req, res) => {
    try {
        let producto = req.body
        console.log(req.body)
        await db.create(producto);
        res.redirect('./loadproduct')
    } 
    catch (error) {
        console.log('error en la creacion de producto' + error)
    }
}

const read = async (req, res) => {
    try {
        let productos = await db.find()
        res.json(productos)
    } 
    catch (error) {
        console.log('error en la lectura de producto' + error)
    }
}

const update = async (req, res) => {
    try {
        let filter = { id : req.body.id}
        let newProduct = {
            name : req.body.name,
            description: req.body.description,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            stock: req.body.stock
        }
        await db.updateOne(filter, newProduct)
        res.json(`el producto con el id ${filter.id} ha sido modificado`)
    } 
    catch (error) {
        console.log('error en la lectura de producto' + error)
    }
}

const deleted = async (req, res) => {
    try {
        let { id } = req.body.id
        await db.deleteOne(id)
        res.send(`producto con el id ${id} eliminado`)
        
    } 
    catch (error) {
        console.log('error eliminando producto' + error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        console.log(req.params)
        let { id } = req.params
        await db.deleteOne({id_producto : id})
        res.send(`producto con el id ${id} eliminado`)
        
    } 
    catch (error) {
        console.log('error eliminando producto' + error)
    }
}

module.exports = {
    write,
    read,
    update,
    deleted,
    deleteProduct
}