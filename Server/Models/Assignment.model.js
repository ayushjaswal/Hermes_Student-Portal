import mongoose, { model, Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    classroomId: { type: mongoose.Types.ObjectId, ref: "classroom", required: true },
    subjectId: { type: mongoose.Types.ObjectId, ref: "subject", required: true },
    submissions: [{ type: mongoose.Types.ObjectId, ref: "submission" }],
    currentlyAvailable: { type: Boolean, default: true },
    assignedTeacher: { type: mongoose.Types.ObjectId, ref: "faculty", required: true },
  },
  { timestamps: true }
);

const assignment = model("assignment", assignmentSchema);

export default assignment;
