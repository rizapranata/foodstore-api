import express from "express";
import { logger } from "./utils/logging";
import { connectDB } from "./database";
import { loging } from "./middleware/log";
import producRouter from "./products/router";
import categoryRouter from "./category/router";
import tagRouter from "./tag/router";
import authRouter from "./auth/router";
import decodeToken from "./middleware/decodeToken";
import regionRouter from "./region/router";
import deliveryAddressRouter from "./delivery-address/router";
import cartRouter from "./cart/router";
import orderRouter from "./order/router";
import invoiceRouter from "./invoice/router";
import userRouter from "./user/router";
import cors from "cors";

const app = express();
const port = 3001;
connectDB();

const FE = {
  origin: "http://localhost:3000", // alamat frontend (Next.js)
  credentials: true, // penting untuk cookie
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(FE));
app.use(loging);
app.use(express.json());
app.use(decodeToken());

app.use("/auth", authRouter);
app.use("/api", producRouter);
app.use("/api", categoryRouter);
app.use("/api", tagRouter);
app.use("/api", regionRouter);
app.use("/api", deliveryAddressRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", invoiceRouter);
app.use("/api", userRouter);

app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port}`);
});

export default app;
