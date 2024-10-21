import mongoose, { model, Schema } from "mongoose";

const classroomModel = new Schema(
  {
    classroomId: { type: String, required: true },
    students: [{ type: mongoose.Types.ObjectId, ref: "student" }],
    facutly: [{ type: mongoose.Types.ObjectId, ref: "faculty" }],
    message: [{ type: mongoose.Types.ObjectId, ref: "message" }],
  },
  { timestamps: true }
);

const classroom = model("classroom", classroomModel);

export default classroom;
