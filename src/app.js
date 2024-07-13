import "dotenv/config";

import express from "express";
import connectDB from "./config/db.js";
import exampleRoutes from "./routes/exampleRoutes.js";

const app = express();

// Connect to database
await connectDB();

// // Middleware
app.use(express.json());

// // Routes
app.use("/api", exampleRoutes);

export default app;
