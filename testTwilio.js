require("dotenv").config();
const twilioSID = process.env.TWILIO_SID;
const twilioTOKEN = process.env.TWILIO_TOKEN;
const client = require("twilio")(twilioSID, twilioTOKEN);


client.messages.create({
     body: 'Hello, world!',
     from: process.env.TWILIO_NUMBER,
     to: '+393317682781'
   })
  .then(message => console.log(message.sid));
