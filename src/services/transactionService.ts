import transactionModel from "../models/TransactionModel";
import { MODEL_NAMES } from "../utils/models";

class TransactionService {
  async getAllTrx() {
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
          to_account_name: "$to_account.name",
        },
      },
    ]);
  }
}

export default new TransactionService();
