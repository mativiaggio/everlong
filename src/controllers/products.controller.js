import ProductsDAO from "../dao/products.dao.js";
import Product from "../models/product.js";
import { logger } from "../utils/logger.js";

const productsDAO = new ProductsDAO();

export default class ProductsController {
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
