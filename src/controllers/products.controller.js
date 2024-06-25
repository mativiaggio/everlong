import ProductsDAO from "../dao/products.dao.js";
import Product from "../models/product.js";
import { logger } from "../utils/logger.js";

const productsDAO = new ProductsDAO();

export default class ProductsController {
  async getProducts(req, res, query, limit, page) {
    try {
      const { sort, query, findBy } = req.query || {};
      const filter = {};

      if (query) {
        filter["$or"] = [{ [findBy]: { $regex: query, $options: "i" } }];
      }

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      let products;
      if (query) {
        products = await productsDAO.getProducts(limit, page, {}, filter);
      } else {
        console.log("entramos al no query");
        console.log(limit, page, sortOptions, filter);
        products = await productsDAO.getProducts(
          limit,
          page,
          sortOptions,
          filter
        );
      }

      console.log(products);

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
      const stackTrace = error.stack.split("\n");
      const errorLine = stackTrace.find((line) =>
        line.includes("at getProducts")
      );

      logger.error(`Error in /products route: ${errorLine}`, error);
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
      logger.error("Error getting product by ID:", error);
      throw error;
    }
  }

  async findBySlug(productSlug) {
    try {
      const product_slug = productSlug;
      const product = await productsDAO.getProductBySlug(product_slug);
      return product;
    } catch (error) {
      logger.error("Error getting product by Slug:", error);
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
      logger.error("Error adding product:", error);
      return res.status(500).json({ error: "Error adding product" });
    }
  }

  async updateProduct(req, res) {
    try {
      const productData = req.body;
      const result = await productsDAO.updateProduct(productData);

      if (result.status === "error") {
        return res.status(500).json(result);
      }

      return res.json(result);
    } catch (error) {
      logger.error("Error updating product:", error);
      return res.status(500).json({ error: "Error updating product" });
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
      logger.error("Error deleting product:", error);
      return res.status(500).json({ error: "Error deleting product" });
    }
  }

  async getProductStats(req, res) {
    try {
      const totalProducts = await productsDAO.countProducts({});
      const productsByCategory = await Product.aggregate([
        { $unwind: "$categories" },
        { $group: { _id: "$categories", count: { $sum: 1 } } },
      ]);
      const lowStockProducts = await Product.find({ stock: { $lt: 10 } });

      res.json({
        status: "success",
        data: {
          totalProducts,
          productsByCategory,
          lowStockProducts,
        },
      });
    } catch (error) {
      logger.error("Error fetching product stats:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}
