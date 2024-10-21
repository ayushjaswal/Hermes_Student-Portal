import mongoose, { model, Schema } from "mongoose";

const messageModel = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    classroomId: {
      type: mongoose.Types.ObjectId,
      ref: "classroom",
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const message = model("message", messageModel);

export default message;
