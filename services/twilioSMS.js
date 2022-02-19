require('dotenv').config()
const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const client = require ('twilio')(twilioAccountSID, twilioAuthToken)

function sendSMS(body){

const messageConfig={
    to: process.env.MARTIN_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Numero de pedido creado ${body} y procesado`
}

client.messages.create(messageConfig)
    .then(message => console.log('mensaje enviado ', message.sid))
    .done()
}
module.exports = { sendSMS }