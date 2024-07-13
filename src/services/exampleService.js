import exampleModel from "../models/exampleModel.js";

class ExampleService {
  async createUser(body) {
    return exampleModel.create(body);
  }
}

export default new ExampleService();
