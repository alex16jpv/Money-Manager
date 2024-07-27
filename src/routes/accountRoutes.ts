import express from "express";
import { getAllAccounts } from "../controllers/accountController";

const router = express.Router();

router.get("/", getAllAccounts);

export default router;
