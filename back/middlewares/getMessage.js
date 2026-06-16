
const Messages = require("../models/Messages.model")


async function getMessage(req, res) {
  try {
    const conversationid = req.body.conversationid
    const messages = await Messages.find({conversationId : conversationid}).sort({createdAt : 1})
    res.status(201).json(messages)
  } catch (err) {
    console.log("There is some issuw with fetching the messages :- ", err);
    res.status(500).json({
      message: "There is some issue with fetching with the message",
    });
  }
}

exports.model = getMessage;
