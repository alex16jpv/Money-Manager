import "dotenv/config";

import express from "express";
import connectDB from "./config/db";
import exampleRoutes from "./routes/exampleRoutes";

const app = async () => {
  const app = express();

  // Connect to database
  await connectDB();

  // // Middleware
  app.use(express.json());

  // // Routes
  app.use("/api", exampleRoutes);

  return app;
};

export default app;
