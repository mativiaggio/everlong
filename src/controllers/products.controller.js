import ProductsDAO from "../dao/products.dao.js";
import Product from "../models/product.js";
import { logger } from "../utils/logger.js";

const productsDAO = new ProductsDAO();

export default class ProductsController {
  /**
   * Retrieves a list of products based on the provided parameters.
   *
   * @param {Object} req - The request object containing query parameters.
   * @param {Object} res - The response object to send the result.
   * @param {number} limit - The maximum number of products to retrieve per page.
   *
   * @returns {Object} - An object containing the result of the operation.
   *
   * @throws Will throw an error if there is a problem with the database operation.
   */
  async getProducts(req, res, limit) {
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

      const products = await productsDAO.getProducts(
        limit,
        page,
        sortOptions,
        filter
      );

      const totalProducts = await productsDAO.countProducts(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      const result = {
        status: "success",
        ResultSet: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/products?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /products route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * Counts the total number of products in the database.
   *
   * @returns {Promise<number>} - A promise that resolves to the total number of products.
   *
   * @throws Will throw an error if there is a problem with the database operation.
   */
  async findById(paramproductId) {
    try {
      const productId = paramproductId;
      const product = await productsDAO.getProductById(productId);
      return product;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw error;
    }
  }

  async findBySlug(productSlug) {
    try {
      const product_slug = productSlug;
      const product = await productsDAO.getProductBySlug(product_slug);
      console.log("Product in Controller:", product);
      return product;
    } catch (error) {
      console.error("Error getting product by Slug:", error);
      throw error;
    }
  }

  async countProducts() {
    try {
      const totalProducts = await Product.countDocuments();
      return totalProducts;
    } catch (error) {
      logger.error("Error contando productos:", error);
      throw error;
    }
  }

  /**
   * Adds a new product to the database.
   *
   * @param {Object} req - The request object containing the product data.
   * @param {Object} res - The response object to send the result.
   * @param {Object} req.body - The product data to be added.
   * @param {string} req.body.name - The name of the product.
   * @param {string} req.body.description - The description of the product.
   * @param {number} req.body.price - The price of the product.
   * @param {string} req.body.category - The category of the product.
   * @param {string} req.body.status - The status of the product.
   * @param {string} req.session.user._id - The ID of the user who is adding the product.
   *
   * @returns {Object} - The response object containing the result of the operation.
   * @returns {number} res.status - The HTTP status code of the response.
   * @returns {Object} res.json - The JSON object containing the result.
   * @returns {string} res.json.error - If there is an error, this property contains the error message.
   *
   * @throws Will throw an error if there is a problem with the database operation.
   */
  async addProduct(req, res) {
    try {
      const productData = req.body;
      productData.owner = req.session.user._id;
      const result = await productsDAO.addProduct(productData);

      if (result.status === "error") {
        return res.status(500).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Error adding product" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid; // Corrected to access params.pid
      const user = req.session.user; // Assuming user information is stored in the session
      const result = await productsDAO.deleteProduct(productId, user);
      if (result.error) {
        return res.status(403).json({ error: result.error });
      }
      return res.json(result);
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ error: "Error deleting product" });
    }
  }
}
