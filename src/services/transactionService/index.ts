import mongoose from "mongoose";
import transactionModel, {
  TransactionType,
} from "../../models/TransactionModel";
import accountModel from "../../models/AccountModel";
import { MODEL_NAMES } from "../../utils/models";
import { TRANSACTION_TYPES } from "../../utils/constants";
import { ProcessTrxInput } from "./types";

class TransactionService {
  async getAllTrx({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }): Promise<TransactionType[]> {
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
          createdAt: -1,
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

  async getTrxById(id: string): Promise<TransactionType | null> {
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

  async createTrx(input: TransactionType): Promise<TransactionType> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { amount, date, type } = input;

      if (date && isNaN(date.getTime())) {
        throw new Error("Date must be a valid date");
      }

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      if (type === TRANSACTION_TYPES.TRANSFER) {
        await this.processTransferTrx({ input, session });
      } else if (type === TRANSACTION_TYPES.INCOME) {
        await this.processIncomeTrx({ input, session });
      } else if (type === TRANSACTION_TYPES.EXPENSE) {
        await this.processExpenseTrx({ input, session });
      } else {
        throw new Error("Invalid transaction type");
      }

      // check the problems with types
      const result = (await transactionModel.create([input], {
        session,
      })) as unknown as TransactionType;

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async processTransferTrx({ input, session }: ProcessTrxInput): Promise<void> {
    const { from_account_id, to_account_id } = input;
    if (!from_account_id || !to_account_id) {
      throw new Error("Both from_account_id and to_account_id are required");
    }
    if (from_account_id === to_account_id) {
      throw new Error("from_account_id and to_account_id must be different");
    }
    const foundAccounts = await accountModel.find(
      {
        _id: { $in: [from_account_id, to_account_id] },
      },
      {
        _id: 1,
      }
    );
    if (foundAccounts.length !== 2) {
      throw new Error("From and to accounts must exist");
    }

    const fromAccount = foundAccounts.find((account) =>
      account._id.equals(from_account_id as string)
    );
    const toAccount = foundAccounts.find((account) =>
      account._id.equals(to_account_id)
    );

    await fromAccount?.updateOne(
      {
        $inc: {
          balance: -input.amount,
        },
      },
      {
        session,
      }
    );
    await toAccount?.updateOne(
      {
        $inc: {
          balance: input.amount,
        },
      },
      {
        session,
      }
    );
  }

  async processIncomeTrx({ input, session }: ProcessTrxInput): Promise<void> {
    const { to_account_id, from_account_id } = input;
    if (!to_account_id) {
      throw new Error("to_account_id is required for income transactions");
    }

    if (from_account_id) {
      throw new Error("from_account_id is not allowed for income transactions");
    }

    const foundAccount = await accountModel.findById(to_account_id, {
      _id: 1,
    });
    if (!foundAccount) {
      throw new Error("to_account_id must exist");
    }

    await foundAccount.updateOne(
      {
        $inc: {
          balance: input.amount,
        },
      },
      {
        session,
      }
    );
  }

  async processExpenseTrx({ input, session }: ProcessTrxInput): Promise<void> {
    const { from_account_id, to_account_id } = input;

    if (!from_account_id) {
      throw new Error("from_account_id is required for expense transactions");
    }

    if (to_account_id) {
      throw new Error("to_account_id is not allowed for expense transactions");
    }

    const foundAccount = await accountModel.findById(from_account_id, {
      _id: 1,
    });

    if (!foundAccount) {
      throw new Error("from_account_id must exist");
    }

    await foundAccount.updateOne(
      {
        $inc: {
          balance: -input.amount,
        },
      },
      {
        session,
      }
    );
  }
}

export default new TransactionService();
