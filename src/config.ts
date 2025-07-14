import dotenv from 'dotenv';
dotenv.config();

process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'foodstore-api';
process.env.SERVICE_PORT = process.env.SERVICE_PORT || '3000';

const SERVICE_NAME = process.env.SERVICE_NAME;
const SERVICE_PORT = process.env.SERVICE_PORT;

export {
  SERVICE_NAME,
  SERVICE_PORT,
}
