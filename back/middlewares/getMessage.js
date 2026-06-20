
const Messages = require("../models/Messages.model")


async function getMessage(req, res) {
  try {
    const {conversationId }= req.query
    const messages = await Messages.find({conversationId }).sort({createdAt : 1})
    res.status(200).json(messages)
  } catch (err) {
    console.log("There is some issuw with fetching the messages :- ", err);
    res.status(500).json({
      message: "There is some issue with fetching with the message",
    });
  }
}

module.exports= getMessage;
