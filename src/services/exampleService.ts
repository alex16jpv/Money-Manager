import exampleModel from "../models/exampleModel";

class ExampleService {
  async createUser(body) {
    return exampleModel.create(body);
  }
}

export default new ExampleService();
