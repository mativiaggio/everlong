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
}
