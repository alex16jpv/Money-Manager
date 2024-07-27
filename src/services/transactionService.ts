import mongoose from "mongoose";
import transactionModel from "../models/TransactionModel";
import { MODEL_NAMES } from "../utils/models";

class TransactionService {
  async getAllTrx({ limit, skip }: { limit: number; skip: number }) {
    return await transactionModel.aggregate([
      {
        $lookup: {
          from: MODEL_NAMES.ACCOUNT,
          localField: "from_account_id",
          foreignField: "_id",
          as: "from_account",
        },
      },
      {
        $lookup: {
          from: MODEL_NAMES.ACCOUNT,
          localField: "to_account_id",
          foreignField: "_id",
          as: "to_account",
        },
      },
      {
        $unwind: {
          path: "$from_account",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$to_account",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          description: 1,
          amount: 1,
          date: 1,
          type: 1,
          category: 1,
          from_account_name: "$from_account.name",
          to_account_name: "$to_account.name",
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  async getTrxById(id: string) {
    const trx = await transactionModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: MODEL_NAMES.ACCOUNT,
          localField: "from_account_id",
          foreignField: "_id",
          as: "from_account",
        },
      },
      {
        $lookup: {
          from: MODEL_NAMES.ACCOUNT,
          localField: "to_account_id",
          foreignField: "_id",
          as: "to_account",
        },
      },
      {
        $unwind: {
          path: "$from_account",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$to_account",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    console.log(trx);

    return trx?.[0] || null;
  }
}

export default new TransactionService();
