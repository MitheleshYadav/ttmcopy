const Messages =  require("../models/Messages.model")

async function sendMessage(req, res){
   try{
    console.log(req.body)
      const conversationid = req.body.conv_id
      const text = req.body.text
      const id = req.body.id
      const message = await Messages.create({
        conversationId : conversationid,
        senderId : id,
        text : text
      })
      res.status(201).json({
        messsage : "Saved"
      })
   }catch(err){
    console.log("There was some issue:-", err);
    res.status(500).json({
        message : "There was some issue at the backend"
    })
   }
}

module.exports = sendMessage