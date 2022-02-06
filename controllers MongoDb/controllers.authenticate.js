const { User : db } = require('../config/db')

const newUser = async(req, res) => {
    console.log(req.body);
    let user  = req.body
    let object = {
        username: user.username,
        userage: user.userage,
        adress: user.useradress,
        userintcod: user.userintcod,
        userareacod: user.userareacod,
        email: user.useremail,
        password: user.userpass
        }
    try {
        await db.create(object)
        res.send("Usuario creado con exito!")     
    } 
    catch (err) {
        console.log('error al guardar el item ', err) 
    }
};

module.exports = { newUser }