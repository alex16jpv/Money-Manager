import express from "express";
import {
  createAccount,
  getAccountById,
  getAllAccounts,
} from "../controllers/accountController";

const router = express.Router();

router.get("/", getAllAccounts);
router.post("/", createAccount);

router.get("/:id", getAccountById);

export default router;
