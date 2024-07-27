import mongoose from "mongoose";
import { MODEL_NAMES } from "../utils/models";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model(MODEL_NAMES.USER, userSchema);

export default UserModel;
