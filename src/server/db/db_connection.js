import mongoose from "mongoose";
import { logger } from "../../utils/logger.js";
import { MONGO_URI } from "../../config/env.js";
import chalk from "chalk";

const connect = async () => {
  try {
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        logger.info(chalk.bgBlue.bold("Mongoose conectado \n"));
      })
      .catch((err) => {
        logger.error(
          chalk.bgRed.bold(`Mongoose connection error: ${err.message}`)
        );
      });
  } catch (err) {
    logger.error(chalk.bgRed.bold(`Mongoose connection error: ${err.message}`));
    process.exit(1);
  }
};
export default connect;
