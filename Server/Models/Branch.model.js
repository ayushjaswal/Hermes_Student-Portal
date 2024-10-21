import mongoose, { model, Schema } from "mongoose";

const branchModel = new Schema(
  {
    branchName: { type: String, required: true },
    branchCode: { type: String, required: true },
    year: { type: String, required: true },
    classroom: { type: mongoose.Types.ObjectId, ref: "classroom" },
  },
  { timestamps: true }
);

const branch = model("branch", branchModel);

export default branch;
