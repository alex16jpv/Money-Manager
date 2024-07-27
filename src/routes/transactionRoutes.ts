import express from "express";
import { getAllTrx, getTrxById } from "../controllers/transactionsController";

const router = express.Router();

router.get("/", getAllTrx);
router.get("/:id", getTrxById);

export default router;
