const nodemailer = require('nodemailer')
const path = require('path')
const { productosModel : dbproducto } = require('../config/db')

const {sendSMS}  = require('./twilioSMS.js')
const {sendWSAP}  = require('./twilioWSAP.js')

const gmailUser = 'martin.ariel.riveros@gmail.com'
const gmailpass = 'wbfyjvnnqbyolkbw'

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

async function newuserEmail(data){

  const {useremail, username, useradress, userage, userintcod, userareacod, userpic } = data[0]
  
  let emailNewUser = `
            <h1>New user added</h1>

            <h3>email: ${useremail}</h3>
            <h3>nombre: ${username}</h3>
            <h3>direccion: ${useradress}</h3>
            <h3>edad: ${userage}</h3>
            <h3>telefono: ${userintcod} ${userareacod}</h3>  
    `
    let messageNewUSer = {
        from: gmailUser,
        to:'beledo.m@gmail.com',
        subject: "Nuevo Registro",
        html: emailNewUser
      };

      const infoNewUser = await transporter.sendMail(messageNewUSer)  
      logger.getLogger('consola').info(infoNewUser.messageId)
}


async function newPurchase(cart){

  
  let cartArray = Object.values(cart)
  sendSMS(cartArray[0].id_carrito)
  
  let tablePurchaseHTML= `
  <h1>Detalle de compra</h1>
  <h2>pedido ${cartArray[0].id_carrito}</h2>
  `
  let total = 0;

  for (const [  i, element ] of cartArray.entries()){
    const articulo =  await dbproducto.find({id_producto: element.id_producto})
  
    tablePurchaseHTML += `
    <h3>Articulo:${articulo[0].name} </h3>
    <h3>Precio unitario:${articulo[0].price}</h3>
    <h3>Cantidad:${element.cantidad}</h3>
    <h3>Precio total del item:${articulo[0].price*element.cantidad}</h3>
    `;
    total += articulo[0].price*element.cantidad
  }
  tablePurchaseHTML += `<h3>El precio total de la compra es: ${total}</h3>`

  let messageNewPurchase = {
    from: gmailUser,
    to:'beledo.m@gmail.com',
    subject: `Nuevo pedido`,
    // subject: `Nuevo pedido de: ${username} - ${useremail}`,
    html: tablePurchaseHTML
  };
  
  const infoNewPurchase = await transporter.sendMail(messageNewPurchase)  
  logger.getLogger('consola').info(infoNewPurchase.messageId)
  sendWSAP(cartArray[0].id_carrito)
  
}

module.exports = { newuserEmail, newPurchase }