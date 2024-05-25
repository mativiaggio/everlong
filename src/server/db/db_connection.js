import mongoose from "mongoose";
import { logger } from "../../utils/logger.js";
import { MONGO_URI } from "../../config/env.js";

const connect = async () => {
  try {
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        logger.info("Mongoose conectado");
      })
      .catch((err) => {
        logger.error(`Mongoose connection error: ${err.message}`);
      });
    logger.info("Mongoose conectado");
  } catch (err) {
    logger.error(`Mongoose connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connect;
