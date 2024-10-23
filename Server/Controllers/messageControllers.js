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

export const sendRoomMessage = async ({
  message: messagvVal,
  roomId,
  senderEmail,
}) => {
  try {
    const userDB = await user.findOne({ email: senderEmail });
    if (userDB) {
      console.log(userDB);
      const messagesCreate = await message.create({
        classroomId: roomId,
        message: messagvVal,
        sender: userDB?._id,
      });
      if(messagesCreate) {
        const createRoomMsg = await classroom.updateOne({ _id: roomId }, { $push: { messages: messagesCreate._id } });
        if (createRoomMsg) {
          console.log("Message sent successfully");
          return;
        }
      }
    } else {
      console.log("User not found");
      return;
    }
  } catch (error) {
    console.log(error);
    return;

  }
};
