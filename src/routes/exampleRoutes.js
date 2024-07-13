import express from "express";
import { createUser } from "../controllers/exampleController.js";

const router = express.Router();

router.post("/example", createUser);

export default router;
