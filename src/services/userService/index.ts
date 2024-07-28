import userModel, { UserType } from "../../models/UserModel";

class UserService {
  async getAllUsers(): Promise<UserType[]> {
    return userModel.find();
  }

  async createUser(): Promise<UserType> {
    return userModel.create({
      name: "John Doe",
      email: "johndoe@test.com",
      username: "johndoe",
    }) as unknown as UserType;
  }
}

export default new UserService();
