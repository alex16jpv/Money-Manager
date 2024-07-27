import transactionModel from "../models/TransactionModel";

class TransactionService {
  async getAllTrx() {
    return await transactionModel.find();
  }
}

export default new TransactionService();
