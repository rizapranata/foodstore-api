// src/index.ts
import express from "express";
import { logger } from "./application/logging";
import { connectDB } from "./database";
import producRouter from "./products/router";
import { loging } from "./middleware/log";

const app = express();
const port = 3000;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(loging);
app.use(express.json());
app.use("/api", producRouter);

app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port}`);
});

export default app;
