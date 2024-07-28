import userModel from "../../models/UserModel";

class UserService {
  async getAllUsers() {
    return userModel.find();
  }

  async createUser() {
    return userModel.create({
      name: "John Doe",
      email: "johndoe@test.com",
      username: "johndoe",
    });
  }
}

export default new UserService();
