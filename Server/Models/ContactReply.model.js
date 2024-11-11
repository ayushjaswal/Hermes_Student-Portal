import mongoose, { model, Schema } from "mongoose";

const contactReplyModel = new Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Types.ObjectId, ref: "faculty", required: true },
}, {timestamps: true})

const contactReply = new model("contactReply", contactReplyModel);

export default contactReply;