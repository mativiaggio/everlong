import Receipt from "../models/receipt.js";
import { logger } from "../utils/logger.js";

export default class ReceiptsDAO {
  async getAllReceipts(limit, page, sortOptions = {}, filter = {}) {
    try {
      const receipts = await Receipt.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      return receipts;
    } catch (error) {
      logger.error("Error al obtener egresos:", error);
      throw error;
    }
  }
  async countReceipts(filter) {
    try {
      const count = await Receipt.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando egresos:", error);
      throw error;
    }
  }
}
