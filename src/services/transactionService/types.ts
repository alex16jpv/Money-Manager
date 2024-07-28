import mongoose from "mongoose";
import { TransactionType } from "../../models/TransactionModel";

export type ProcessTrxInput = {
  input: TransactionType;
  session: mongoose.ClientSession;
};
