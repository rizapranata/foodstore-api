// src/index.ts
import express from "express";
import { logger } from "./application/logging";
import { connectDB } from "./database";
import { loging } from "./middleware/log";
import producRouter from "./products/router";
import categoryRouter from "./category/router";

const app = express();
const port = 3000;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(loging);
app.use(express.json());

app.use("/api", producRouter);
app.use("/api", categoryRouter);

app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port}`);
});

export default app;
