// src/database/index.ts
import mongoose from "mongoose";
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../config";
import { logger } from "../application/logging";

const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
