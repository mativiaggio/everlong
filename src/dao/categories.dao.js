import Category from "../models/category.js";
import { logger } from "../utils/logger.js";

export default class CategoriesDAO {
  async getAll() {
    try {
      const categories = await Category.find().lean();
      return categories;
    } catch (error) {
      logger.error("Error al obtener categorias:", error);
      throw error;
    }
  }
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

  async getCategoryBySlug(categorySlug) {
    logger.info("id " + categorySlug);
    try {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) {
        return category;
      } else {
        logger.error("Categoría no encontrada");
        return null;
      }
    } catch (error) {
      logger.error("Error al obtener la categoría:", error);
      return null;
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
