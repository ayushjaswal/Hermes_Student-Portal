import mongoose, { model, Schema } from "mongoose";

const facultyUserModel = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    DOB: { type: Date, unique: true },
    phoneNumber: { type: String, unique: true },
    subjects: [{ type: mongoose.Types.ObjectId, ref: "subject" }],
    classroom: [{ type: mongoose.Types.ObjectId, ref: "classroom" }],
  },
  { timestamps: true }
);

const faculty = model("faculty", facultyUserModel);

export default faculty;
