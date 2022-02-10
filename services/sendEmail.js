const nodemailer = require('nodemailer')
const path = require('path')
const { productosModel : dbproducto } = require('../config/db')
const {sendSMS}  = require('./sendSMSCarrito.js')

const gmailUser = 'martin.ariel.riveros@gmail.com'
const gmailpass = 'wbfyjvnnqbyolkbw'

let useremail= gmailUser
let username= 'martinriveros'
let useradress='Altos de la Ribera L18'
let userage= 45
let userphone= +5493426142160
let userpic= path.join(__dirname, './testavatar.jpg')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp-relay.gmail.com",   //https://support.google.com/a/answer/176600?hl=es
    port: 25,                      // three work 25, 465, 587
    secure: false,                     // upgrade later with STARTTLS
    auth: {
      user: gmailUser,
      pass: gmailpass,
    },
    tls:{
      rejectUnauthorized: false   //matches the host to allow localhost or any other
    }
  });

async function newuserEmail(req, res, next){
  // const {useremail, userpass, username, useradress, userage, userphone, userpic } = req.body
  
    let emailNewUser = `
            <h1>New user added</h1>

            <h3>email: ${useremail}</h3>
            <h3>nombre: ${username}</h3>
            <h3>direccion: ${useradress}</h3>
            <h3>edad: ${userage}</h3>
            <h3>telefono: ${userphone}</h3>
            <h3>foto: ${userpic}</h3>  
    `
    let messageNewUSer = {
        from: gmailUser,
        to:'martin.riveros@hotmail.com',
        subject: "Nuevo Registro",
        html: emailNewUser
      };

      const infoNewUser = await transporter.sendMail(messageNewUSer)  
      console.log(infoNewUser.messageId)
}
async function newPurchaseEmail(cart){
    
  let cartArray = Object.values(cart)
  
  sendSMS(cartArray[0].id_carrito)
  sendWAPP(cartArray[0].id_carrito)
  
  let tablePurchaseHTML= `
  <h1>Detalle de compra</h1>
  <h2>pedido ${cartArray[0].id_carrito}</h2>
`
  for (const element of cartArray){

  const articulo =  await dbproducto.findOne({id_producto:element.id_producto})

  tablePurchaseHTML += `
                      <h3>Articulo:${articulo.name} </h3><h3>Precio unitario:${articulo.price}</h3><h3>Cantidad:${element.cantidad}</h3><h3>Precio total del item:${articulo.price*element.cantidad}</h3> 
                      `;
}
let messageNewPurchase = {
                            from: gmailUser,
                            to:'martin.riveros@hotmail.com',
                            subject: `Nuevo pedido de: ${username} - ${useremail}`,
                            html: tablePurchaseHTML
};

const infoNewPurchase = await transporter.sendMail(messageNewPurchase)  
console.log(infoNewPurchase.messageId)

}

module.exports = { newuserEmail, newPurchaseEmail }