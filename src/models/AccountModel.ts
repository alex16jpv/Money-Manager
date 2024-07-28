import mongoose from "mongoose";
import { ACCOUNT_TYPES } from "../utils/constants";
import { MODEL_NAMES } from "../utils/models";

export type AccountType = {
  name: string;
  type: keyof typeof ACCOUNT_TYPES;
  balance?: number;
  user_id?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Schema.Types.ObjectId;
};

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
  { timestamps: true, versionKey: false }
);

const AccountModel = mongoose.model(MODEL_NAMES.ACCOUNT, accountSchema);

export default AccountModel;
