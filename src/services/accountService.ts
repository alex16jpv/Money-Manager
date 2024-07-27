import accountModel from "../models/AccountModel";

class AccountService {
  async getAllAccounts() {
    return accountModel.find();
  }
}

export default new AccountService();
