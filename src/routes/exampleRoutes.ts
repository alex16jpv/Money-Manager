import express from "express";
import { createUser } from "../controllers/exampleController";

const router = express.Router();

router.post("/example", createUser);

export default router;
