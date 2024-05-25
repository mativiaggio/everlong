import { NODE_ENV } from "../config/env.js";
import { logger, prodLogger, devLogger } from "../utils/logger.js";

export const addLogger = (req, res, next) => {
  if (NODE_ENV === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  req.logger.info(`NODE_ENV ${NODE_ENV}`);
  req.logger.http(
    `${req.method} to ${req.url} - ${new Date().toLocaleDateString()}`
  );

  next();
};
