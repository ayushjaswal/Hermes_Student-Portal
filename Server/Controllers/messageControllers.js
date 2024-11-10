import classroom from "../Models/Classroom.model.js";
import message from "../Models/Message.model.js";
import user from "../Models/User.model.js";

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await message
      .find({ classroomId: roomId })
      .populate({ path: "sender", select: "-passowrd -firstTime" });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const sendRoomMessage = async ({ message: messageVal, roomId, senderEmail }) => {
  try {
    // Find the user in the database
    const userDB = await user.findOne({ email: senderEmail });
    if (userDB) {
      console.log(userDB);

      const messagesCreate = await message.create({
        classroomId: roomId,
        message: messageVal,
        sender: userDB._id,
      });

      if (messagesCreate) {
        const createRoomMsg = await classroom.updateOne(
          { _id: roomId },
          { $push: { messages: messagesCreate._id } }
        );

        if (createRoomMsg.modifiedCount > 0) {
          console.log("Message sent successfully");
          return messagesCreate;
        } else {
          console.log("Failed to update the classroom with the new message");
        }
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error sending room message:", error);
  }
  return null;
};

