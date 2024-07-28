import mongoose from "mongoose";
import transactionModel from "../models/TransactionModel";
import accountModel from "../models/AccountModel";
import { MODEL_NAMES } from "../utils/models";
import { TRANSACTION_TYPES } from "../utils/constants";

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

    return trx?.[0] || null;
  }

  async createTrx(input: {
    amount: number;
    date: Date;
    type: string;
    from_account_id: string;
    to_account_id: string;
    description?: string;
    category?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { from_account_id, to_account_id, amount, date, type } = input;

      if (date && isNaN(date.getTime())) {
        throw new Error("Date must be a valid date");
      }

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      if (type === TRANSACTION_TYPES.TRANSFER) {
        if (!from_account_id || !to_account_id) {
          throw new Error(
            "Both from_account_id and to_account_id are required"
          );
        }
        if (from_account_id === to_account_id) {
          throw new Error(
            "from_account_id and to_account_id must be different"
          );
        }
        const foundAccounts = await accountModel.find(
          {
            _id: { $in: [from_account_id, to_account_id] },
          },
          {
            _id: 1,
          },
          { session }
        );
        if (foundAccounts.length !== 2) {
          throw new Error("From and to accounts must exist");
        }
      } else if (type === TRANSACTION_TYPES.INCOME) {
        if (!to_account_id) {
          throw new Error("to_account_id is required for income transactions");
        }

        if (from_account_id) {
          throw new Error(
            "from_account_id is not allowed for income transactions"
          );
        }

        const foundAccount = await accountModel.findById(to_account_id);
        if (!foundAccount) {
          throw new Error("to_account_id must exist");
        }
      } else if (type === TRANSACTION_TYPES.EXPENSE) {
        if (!from_account_id) {
          throw new Error(
            "from_account_id is required for expense transactions"
          );
        }

        if (to_account_id) {
          throw new Error(
            "to_account_id is not allowed for expense transactions"
          );
        }

        const foundAccount = await accountModel.findById(from_account_id);
        if (!foundAccount) {
          throw new Error("from_account_id must exist");
        }
      }

      const result = await transactionModel.create([input], { session });

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

export default new TransactionService();
