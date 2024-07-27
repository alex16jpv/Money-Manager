import mongoose from "mongoose";
import { ACCOUNT_TYPES } from "../utils/constants";
import { MODEL_NAMES } from "../utils/models";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ACCOUNT_TYPES,
    },
    balance: {
      type: Number,
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: false,
    },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model(MODEL_NAMES.ACCOUNT, accountSchema);

export default AccountModel;
