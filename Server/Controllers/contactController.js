import contact from "../Models/Contact.model.js";
import contactReply from "../Models/ContactReply.model.js";

export const fetchContactMessages = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const messages = await contact
      .find({
        $or: [
          { reciever: recieverId },
          { closedCaptions: { $in: recieverId } },
        ],
      })
      .populate([
        { path: "sender", select: "avatar name enrollment email" },
        { path: "closedCaptions", select: "name email" },
      ])
      .sort({ createdAt: -1 });
    if (messages && messages.length > 0) {
      return res.status(200).json(messages);
    } else {
      return res
        .status(404)
        .json({ message: "No messages found for this recipient" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching contact messages" });
  }
};

export const createContactMessage = async (req, res) => {
  try {
    const {
      senderId,
      recieverId,
      message,
      closedCaptions,
      attachments,
      messageSubject,
    } = req.body;
    const newMessage = new contact({
      sender: senderId,
      reciever: recieverId,
      message,
      closedCaptions,
      attachments,
      messageSubject,
    });
    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating contact message" });
  }
};

export const fetchSingleContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await contact.findById(messageId).populate([
      { path: "sender", select: "avatar name enrollment email" },
      { path: "closedCaptions", select: "name email" },
      {
        path: "replies",
        select: "content sender",
        populate: { path: "sender", select: "email name avatar" },
      },
    ]);
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }
    if (message) {
      return res.status(200).json(message);
    } else {
      return res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching contact message" });
  }
};

export const replyContactMessage = async (req, res) => {
  try {
    const { messageId, content, sender } = req.body;
    const newReply = await contactReply.create({
      content,
      sender,
    });
    newReply.populate({ path: "sender", select: "name email avatar" });

    const message = await contact
      .findByIdAndUpdate(
        messageId,
        { $push: { replies: newReply._id } },
        { new: true }
      )
      .populate([
        { path: "sender", select: "avatar name enrollment email" },
        { path: "closedCaptions", select: "name email" },
        { path: "replies", populate: { path: "sender", select: "name email" } },
      ]);

    if (message) {
      return res.status(200).json(newReply);
    } else {
      return res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error replying to contact message" });
  }
};
