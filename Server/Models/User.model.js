import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstTime: { type: Boolean, default: true },
    faculty: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const user = model("user", userSchema);

export default user;
