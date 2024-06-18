import InvoicesDAO from "../dao/invoices.dao.js";
import Invoice from "../models/invoice.js";
import { logger } from "../utils/logger.js";

const invoicesDAO = new InvoicesDAO();

export default class InvoicesController {
  async getAllInvoices(req, res, limit) {
    try {
      const { page = 1, sort, query } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (query) {
      }

      const sortOptions = {};
      if (sort) {
      }

      const invoices = await invoicesDAO.getAllInvoices(
        limit,
        page,
        sortOptions,
        filter
      );
      //   const sortedUsers = sortUsers(users);
      const totalInvoices = await invoicesDAO.countInvoices(filter);
      const totalPages = Math.ceil(totalInvoices / limit);

      const result = {
        status: "success",
        ResultSet: invoices,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/invoices?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/invoices?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /invoices route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
  async countInvoices() {
    try {
      const totalInvoices = await invoicesDAO.countInvoices();
      return totalInvoices;
    } catch (error) {
      logger.error("Error contando categorias:", error);
      throw error;
    }
  }
}
