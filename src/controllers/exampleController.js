import exampleService from "../services/exampleService.js";

export const createUser = async (req, res) => {
  try {
    const user = await exampleService.createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
