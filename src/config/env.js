import { config } from "dotenv";
config();

const PORT = process.env.PORT;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CALLBACK_URL = process.env.CALLBACK_URL;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const mailing = {
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_PORT: process.env.EMAIL_PORT,
  auth: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  },
};
const NODE_ENV = process.env.NODE_ENV;

export {
  PORT,
  MONGO_PASSWORD,
  MONGO_URI,
  CLIENT_ID,
  CALLBACK_URL,
  CLIENT_SECRET,
  mailing,
  NODE_ENV,
};
