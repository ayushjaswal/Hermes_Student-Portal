import mongoose, { model, Schema } from "mongoose";

const facultyUserModel = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, unique: true },
    secondName: { type: String, required: true, unique: true },
    avatar: { type: String },
    DOB: { type: Date, required: true, unique:true },
    phoneNumber: { type: String, required: true, unique:true },
    subjects: [{ type: mongoose.Types.ObjectId, ref: 'Subject' }]
  },
  { timestamps: true }
);

const faculty = model("faculty", facultyUserModel);

export default faculty;
