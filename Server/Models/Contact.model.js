import mongoose, { model, Schema } from "mongoose";

const contactModel = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: "student" },
    reciever: { type: mongoose.Types.ObjectId, required: true, ref: "faculty" },
    closedCaptions: [{ type: mongoose.Types.ObjectId, ref: "faculty" }],
    messageSubject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    replies: [{ type: mongoose.Types.ObjectId, ref: "contactReply" }],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

const contact = model("contact", contactModel);

export default contact;
