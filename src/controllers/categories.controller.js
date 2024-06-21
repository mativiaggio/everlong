import CategoriesDAO from "../dao/categories.dao.js";
import Category from "../models/category.js";
import { logger } from "../utils/logger.js";

const categoriesDAO = new CategoriesDAO();

export default class CategoriesController {
  async getAll() {
    try {
      const categories = await categoriesDAO.getAll();
      return categories;
    } catch (error) {
      logger.error("Error getting categories:", error);
    }
  }

  async getCategories(req, res, limit) {
    try {
      const { page = 1, sort, query } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (query) {
        filter["$or"] = [
          { category: { $regex: query, $options: "i" } },
          { status: { $regex: query, $options: "i" } },
        ];
      }

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      const categories = await categoriesDAO.getCategories(
        limit,
        page,
        sortOptions,
        filter
      );

      const totalCategories = await categoriesDAO.countCategories(filter);
      const totalPages = Math.ceil(totalCategories / limit);

      const result = {
        status: "success",
        ResultSet: categories,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/categories?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/categories?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /categories route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async findBySlug(categorySlug) {
    try {
      const category_slug = categorySlug;
      const category = await categoriesDAO.getCategoryBySlug(category_slug);
      return category;
    } catch (error) {
      logger.error("Error getting category by Slug:", error);
      throw error;
    }
  }

  async countCategories() {
    try {
      const totalCategories = await Category.countDocuments();
      return totalCategories;
    } catch (error) {
      logger.error("Error contando categorias:", error);
      throw error;
    }
  }
}
