import express from "express";
import accountService from "../services/accountService";

export const getAllAccounts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await accountService.getAllAccounts();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
