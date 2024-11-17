// models/result.js
import mongoose, { Schema, model } from "mongoose";

const resultSchema = new Schema(
  {
    student: { type: mongoose.Types.ObjectId, ref: "student", required: true },
    subject: { type: mongoose.Types.ObjectId, ref: "subject", required: true },
    semester: { type: Number, required: true },
    internalMarks: { type: Number, required: true },
    externalMarks: { type: Number, required: true },
    midSemMarks: { type: Number, default: 0},
    totalMarks: { type: Number, default: 100 },
    remarks: { type: String },
  },
  { timestamps: true }
);

// Virtual field to calculate total obtained marks (internal + external)
resultSchema.virtual("marksObtained").get(function () {
  return this.internalMarks + this.externalMarks;
});

const Result = model("result", resultSchema);
export default Result;
