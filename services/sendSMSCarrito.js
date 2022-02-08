module.exports.sendSMS = ()=>{require('dotenv').config()

const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN

const client = require ('twilio')(twilioAccountSID, twilioAuthToken)


client.messages.create({
    to: process.env.MARTIN_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: 'this is the god damm message'



}).then(message => console.log('mensaje enviado ', message.id))}

