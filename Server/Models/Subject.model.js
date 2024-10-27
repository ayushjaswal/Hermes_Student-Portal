import mongoose, { model, Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    paperName: { type: String, required: true, unique: true },
    paperCode: { type: String, required: true, unique: true },
    associatedFaculty: [
      { type: mongoose.Types.ObjectId, ref: "faculty" },
    ],
    credits: { type: Number, required: true },
    semester: { type: Number, required: true },
    assignments: [{type: mongoose.Types.ObjectId, ref: "assignment"  }],
  },
  { timestamps: true }
);

const subject = model("subject", subjectSchema);

export default subject;
