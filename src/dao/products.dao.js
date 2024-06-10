import Product from "../models/product.js";
import { logger } from "../utils/logger.js";

export default class ProductsDAO {
  async getProducts(limit, page) {
    try {
      const products = await Product.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      return products;
    } catch (error) {
      logger.error("Error al obtener productos:", error);
      throw error;
    }
  }

  async getProductById(productId) {
    logger.info("id " + productId);
    try {
      const product = await Product.findById(productId).lean();

      if (product) {
        return product;
      } else {
        logger.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      logger.error("Error al obtener el producto:", error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      if (!productData.owner) {
        productData.owner = "admin";
      }
      // FALTA LOGICA PARA Q SOLO AGREGUE ADMINS
      const product = new Product(productData);
      await product.save();
      return { status: "Producto agregado correctamente" };
    } catch (error) {
      logger.error("Error al agregar el producto:", error);
      return { error: "Error al agregar el producto: " + error };
    }
  }

  async countProducts(filter) {
    try {
      const count = await Product.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando productos:", error);
      throw error;
    }
  }

  async deleteProduct(productId, user) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        logger.error("Producto no encontrado");
        return { error: "Producto no encontrado" };
      }

      if (!user.roles.includes("admin")) {
        return { error: "No tiene permiso para eliminar este producto" };
      }

      await Product.deleteOne({ _id: productId });
      logger.info("Producto eliminado correctamente");
      return { status: "Producto eliminado correctamente" };
    } catch (error) {
      logger.error("Error al eliminar el producto:", error);
      return { error: "Error al eliminar el producto" };
    }
  }
}
