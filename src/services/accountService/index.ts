import accountModel from "../../models/AccountModel";
import { ACCOUNT_TYPES } from "../../utils/constants";

class AccountService {
  async getAllAccounts() {
    return accountModel.aggregate([
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  async getAccountById(id: string) {
    return accountModel.findById(id);
  }

  async createAccount({
    name,
    type,
    balance = 0,
  }: {
    name: string;
    type: keyof typeof ACCOUNT_TYPES;
    balance: number;
  }) {
    if (isNaN(balance)) {
      throw new Error("Balance must be a number");
    }

    if (!balance) {
      throw new Error("Balance is required");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    if (!ACCOUNT_TYPES?.[type]) {
      throw new Error(
        `Invalid account type ${type}. Valid types are: ${Object.keys(
          ACCOUNT_TYPES
        ).join(", ")}`
      );
    }

    return accountModel.create({ name, type, balance });
  }
}

export default new AccountService();
