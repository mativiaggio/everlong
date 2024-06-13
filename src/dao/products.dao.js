import Product from "../models/product.js";
import { logger } from "../utils/logger.js";

export default class ProductsDAO {
  /**
   * Retrieves a list of products from the database.
   *
   * @param {number} limit - The maximum number of products to retrieve.
   * @param {number} page - The page number to retrieve.
   * @returns {Promise<Array>} A promise that resolves to an array of product objects.
   * @throws {Error} If an error occurs while retrieving products.
   */
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

  /**
   * Adds a new product to the database.
   *
   * @param {Object} productData - The data of the product to be added.
   * @param {string} productData.name - The name of the product.
   * @param {string} productData.description - The description of the product.
   * @param {number} productData.price - The price of the product.
   * @param {string} [productData.owner] - The owner of the product. Defaults to "admin".
   * @returns {Promise<Object>} A promise that resolves to an object with a status message or an error message.
   * @throws {Error} If an error occurs while adding the product.
   */
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

  /**
   * Counts the number of products in the database based on a given filter.
   *
   * @param {Object} filter - The filter object to apply when counting products.
   * @returns {Promise<number>} A promise that resolves to the count of products.
   * @throws {Error} If an error occurs while counting products.
   */
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
