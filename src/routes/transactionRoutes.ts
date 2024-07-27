import express from "express";
import { getAllTrx } from "../controllers/transactionsController";

const router = express.Router();

router.get("/", getAllTrx);

export default router;
