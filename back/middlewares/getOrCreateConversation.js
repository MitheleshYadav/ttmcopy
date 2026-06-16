const Conversation = require("../models/Coversation.model");

async function getOrCreateConversation(req, res) {
  try {
    console.log("API HIIIIITTTT")
    const loggedInUserId = req.user.userId;
    const otherUserId = req.body.otherUser;
    var conversation = await Conversation.findOne({
      participants: { $all: [loggedInUserId, otherUserId] },
    }); //Find conversation where BOTH loggedInUserId and otherUserId so no duplicate conversations

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [loggedInUserId, otherUserId],
      });
    }
    res.json(conversation);
  } catch (err) {
    console.log("There is some issue:- ", err);
    res.status(500).json({
      message: "There is some issue",
    });
  }
}

module.exports = getOrCreateConversation;


//chirag logged in - loggedin userId
//admin is the one with whom chirag is talking in that case the OtherUserId
