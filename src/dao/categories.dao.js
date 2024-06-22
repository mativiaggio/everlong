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

  async updateCategory(categoryData) {
    try {
      const categoryId = categoryData.id;
      delete categoryData.id;

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        categoryData,
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return {
          status: "error",
          message: "Categoría no encontrada",
        };
      }

      return {
        status: "categoría actualizada correctamente",
        category: updatedCategory,
      };
    } catch (error) {
      logger.error("Error al actualizar la categoría:", error);
      return {
        status: "error",
        message: "Error al actualizar la categoría: " + error,
      };
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
