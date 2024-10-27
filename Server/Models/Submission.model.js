import mongoose, { model, Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    studentId: { type: mongoose.Types.ObjectId, ref: "student", required: true },
    assignmentId: { type: mongoose.Types.ObjectId, ref: "assignment", required: true },
    submittedFile: { type: String, required: true },
    grade: { type: Number },
  },
  { timestamps: true }
);

const submission = model("submission", submissionSchema);

export default submission;
