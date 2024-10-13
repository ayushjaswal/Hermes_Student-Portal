import mongoose, { model, Schema } from "mongoose";

const branchModel = new Schema(
  {
    branchName: { type: String, required: true },
    branchCode: { type: String, required: true },
  },
  { timestamps: true }
);

const branch = model("branch", branchModel);

export default branch;
