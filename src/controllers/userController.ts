import express from "express";
import userService from "../services/userService";

export const getAllUsers = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const result = await userService.getAllUsers();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createUser = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const user = await userService.createUser();

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
