import mongoose, { model, Schema } from "mongoose";

const studentUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    enrollment: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    avatar: { type: String },
    DOB: { type: Date, unique: true },
    phoneNumber: { type: String, unique: true },
    ABCId: { type: String, unique: true },
    branchId: { type: mongoose.Types.ObjectId, required: true, ref: "branch" },
    subjects: [
      { type: mongoose.Types.ObjectId, required: true, ref: "subject" },
    ],
    classroom: { type: mongoose.Types.ObjectId, ref: "classroom" },
    submissions: [{type: mongoose.Schema.Types.ObjectId, ref: "submission"  }],
  },
  { timestamps: true }
);

const student = model("student", studentUserSchema);

export default student;
