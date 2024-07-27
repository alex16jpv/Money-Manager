import express from "express";
import transactionService from "../services/transactionService";

export const getAllTrx = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const result = await transactionService.getAllTrx({
      limit: Number(limit),
      skip: Number(skip),
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
