import express from "express";
import accountService from "../services/accountService";

export const getAllAccounts = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const result = await accountService.getAllAccounts();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAccountById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") {
      res.status(400).json({ message: "Account ID is required" });
      return;
    }

    const result = await accountService.getAccountById(id);
    if (!result) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createAccount = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, type, balance } = req.body;

    const result = await accountService.createAccount({
      name,
      type,
      balance,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
