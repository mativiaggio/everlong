import Invoice from "../models/invoice.js";
import { logger } from "../utils/logger.js";

export default class InvoicesDAO {
  async getAllInvoices(limit, page, sortOptions = {}, filter = {}) {
    try {
      const invoices = await Invoice.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      return invoices;
    } catch (error) {
      logger.error("Error al obtener ingresos:", error);
      throw error;
    }
  }
  async countInvoices(filter) {
    try {
      const count = await Invoice.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando ingresos:", error);
      throw error;
    }
  }
}
