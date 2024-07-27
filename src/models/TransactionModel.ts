import mongoose from "mongoose";
import { TRANSACTION_TYPES } from "../utils/constants";
import { MODEL_NAMES } from "../utils/models";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    from_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.ACCOUNT,
      required: false,
    },
    to_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.ACCOUNT,
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

const TransactionModel = mongoose.model(
  MODEL_NAMES.TRANSACTION,
  transactionSchema
);

export default TransactionModel;
