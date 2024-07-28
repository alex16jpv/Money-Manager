import express from "express";
import {
  createTrx,
  getAllTrx,
  getTrxById,
} from "../controllers/transactionsController";

const router = express.Router();

router.get("/", getAllTrx);
router.post("/", createTrx);

router.get("/:id", getTrxById);

export default router;
