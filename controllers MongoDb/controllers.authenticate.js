const { User : db } = require('../config/db')

const newUser = async(req, res) => {
    console.log(req.body);
    let object = req.body
    try {
        await db.create(object)
        res.send("Usuario creado con exito!")     
    } 
    catch (err) {
        console.log('error al guardar el item ', err) 
    }
};

module.exports = { newUser }