import message from "../Models/Message.model.js";

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

export const sendRoomMessage = async (req, res) => {
  try {
    const { roomId, message, io } = req.body;
    
    const messages = await message
      .create({ classroomId: roomId, message, senderId,  })
      .populate({ path: "sender", select: "-passowrd -firstTime" });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json(error);
  }
};

