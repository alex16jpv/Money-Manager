import "dotenv/config";

import express from "express";
import connectDB from "./config/db";

// Routes
import userRoutes from "./routes/userRoutes";
import trxRoutes from "./routes/transactionRoutes";
import accountRoutes from "./routes/accountRoutes";

// Connect to database
connectDB();
const app = express();

// // Middleware
app.use(express.json());

// // Routes
app.use("/users", userRoutes);
app.use("/accounts", accountRoutes);
app.use("/transactions", trxRoutes);

export default app;
