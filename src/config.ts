import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'foodstore-api';
process.env.SERVICE_PORT = process.env.SERVICE_PORT || '3000';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '27017';
process.env.DB_NAME = process.env.DB_NAME || 'foodstore';
process.env.DB_USER = process.env.DB_USER || 'rizapranata';
process.env.DB_PASS = process.env.DB_PASS || 'rahasia';
process.env.SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey';
process.env.MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
process.env.MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

const UPLOAD_DIR = path.join(__dirname, '../public/uploads/');
const SERVICE_NAME = process.env.SERVICE_NAME;
const SERVICE_PORT = process.env.SERVICE_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const SECRET_KEY = process.env.SECRET_KEY;
const MONGODB_USERNAME = process.env.MONGO_INITDB_ROOT_PASSWORD
const MONGODB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD

export {
  SERVICE_NAME,
  SERVICE_PORT,
  UPLOAD_DIR,
  SECRET_KEY,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  MONGODB_PASS,
  MONGODB_USERNAME
}
