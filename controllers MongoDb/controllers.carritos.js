const { carritosModel : db } = require('../config/db')

    const write = async (req, res) => {
        // console.log(req.body) Recieves the purchase like an object.
        let carrito  = req.body
        let object = {
            id : carrito[0].id_carrito,
            productos_carrito: carrito
        }
            try {
               await db.create(object)
               res.send("Carrito creado con exito!")     
                } 
            catch (err) {
               console.log('error al guardar el item ', err) 
                }
    }

    const read = async (req, res) => {
        try {
            let carritos = await db.find()
            res.json(carritos) 
            } 
        catch (err) {
            console.log('error al leer los carritos', err)
        }
    }

    const deleted = async (req, res) => {
        try {
            let { id } = req.params
            await db.deleteOne(id)
            res.send(`carrito con el id ${id} eliminado`)
            
        } catch (error) {
            console.log('error eliminando producto' + error)
    
        }
    }

module.exports = {
    write,
    read,
    deleted
}