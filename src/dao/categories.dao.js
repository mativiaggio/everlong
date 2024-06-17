import Category from "../models/category.js";
import { logger } from "../utils/logger.js";

export default class CategoriesDAO {
  async getCategories(limit, page) {
    try {
      const categories = await Category.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("parent", "name")
        .lean();

      return categories;
    } catch (error) {
      logger.error("Error al obtener categorias:", error);
      throw error;
    }
  }
  async countCategories(filter) {
    try {
      const count = await Category.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando categorias:", error);
      throw error;
    }
  }
}
