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
   * Retrieves a product by its ID from the database.
   *
   * @param {string} productId - The ID of the product to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves to the product object if found, or null if not found.
   * @throws {Error} If an error occurs while retrieving the product.
   */
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

  async getProductBySlug(productSlug) {
    logger.info("id " + productSlug);
    try {
      const product = await Product.findOne({ slug: productSlug }).lean();
      console.log("Product in DAO: " + product);
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

      const productBySlug = await Product.findOne({ slug: productData.slug });

      if (productBySlug) {
        return {
          status: "error",
          field: ["slug"],
          message: "Ya existe un producto con ese slug",
        };
      } else {
        // FALTA LOGICA PARA Q SOLO AGREGUE ADMINS
        const product = new Product(productData);
        await product.save();
        return { status: "Producto agregado correctamente" };
      }
    } catch (error) {
      logger.error("Error al agregar el producto:", error);
      return { error: "Error al agregar el producto: " + error };
    }
  }

  /**
   * Updates an existing product in the database.
   *
   * @param {Object} productData - The data of the product to be updated.
   * @param {string} productData.id - The ID of the product to be updated.
   * @param {string} productData.name - The name of the product.
   * @param {string} productData.description - The description of the product.
   * @param {number} productData.price - The price of the product.
   * @param {string} productData.category - The category of the product.
   * @param {string} productData.status - The status of the product.
   * @returns {Promise<Object>} A promise that resolves to an object with a status message or an error message.
   * @throws {Error} If an error occurs while updating the product.
   */
  async updateProduct(productData) {
    try {
      const productId = productData.id;
      delete productData.id; // Remove ID from data to avoid updating it

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        productData,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return {
          status: "error",
          message: "Producto no encontrado",
        };
      }

      return {
        status: "Producto actualizado correctamente",
        product: updatedProduct,
      };
    } catch (error) {
      logger.error("Error al actualizar el producto:", error);
      return { error: "Error al actualizar el producto: " + error };
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
