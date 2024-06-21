// invoices.dao.js
import Invoice from "../models/invoice.js";
import { logger } from "../utils/logger.js";

export default class InvoicesDAO {
  async getAllInvoices(limit, page, sortOptions = {}, filter = {}) {
    try {
      const invoices = await Invoice.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)
        .lean();

      return invoices;
    } catch (error) {
      logger.error("Error al obtener ingresos:", error);
      throw error;
    }
  }

  async countInvoices(filter = {}) {
    try {
      const count = await Invoice.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando ingresos:", error);
      throw error;
    }
  }

  async getTotalInvoicesByMonth() {
    try {
      const stats = await Invoice.aggregate([
        {
          $addFields: {
            issueDate: { $toDate: "$issueDate" },
          },
        },
        {
          $group: {
            _id: { $month: "$issueDate" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return stats;
    } catch (error) {
      logger.error("Error obteniendo total de facturas por mes:", error);
      throw error;
    }
  }

  async getTotalAmountByMonth() {
    try {
      const stats = await Invoice.aggregate([
        {
          $addFields: {
            issueDate: { $toDate: "$issueDate" },
          },
        },
        {
          $group: {
            _id: { $month: "$issueDate" },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return stats;
    } catch (error) {
      logger.error("Error obteniendo total de montos por mes:", error);
      throw error;
    }
  }

  async getInvoicesByType() {
    try {
      const stats = await Invoice.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]);
      return stats;
    } catch (error) {
      logger.error("Error obteniendo total de facturas por tipo:", error);
      throw error;
    }
  }
}
