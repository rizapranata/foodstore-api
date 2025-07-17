import express from "express";
import { logger } from "./utils/logging";
import { connectDB } from "./database";
import { loging } from "./middleware/log";
import producRouter from "./products/router";
import categoryRouter from "./category/router";
import tagRouter from "./tag/router";
import authRouter from "./auth/router";
import decodeToken from "./middleware/decodeToken";

const app = express();
const port = 3000;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(loging);
app.use(express.json());
app.use(decodeToken());

app.use("/auth", authRouter);
app.use("/api", producRouter);
app.use("/api", categoryRouter);
app.use("/api", tagRouter);


app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port}`);
});

export default app;
