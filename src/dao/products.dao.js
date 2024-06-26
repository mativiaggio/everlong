import Product from "../models/product.js";
import { logger } from "../utils/logger.js";

export default class ProductsDAO {
  async getProducts(limit, page, sortOptions = {}, filter = {}) {
    try {
      const products = await Product.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)
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
      logger.error("Error retrieving product:", error);
      return null;
    }
  }

  async getProductBySlug(productSlug) {
    logger.info("id " + productSlug);
    try {
      const product = await Product.findOne({ slug: productSlug }).lean();
      if (product) {
        return product;
      } else {
        logger.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      logger.error("Error retrieving product:", error);
      return null;
    }
  }

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
      logger.error("Error adding product:", error);
      return { error: "Error adding product: " + error };
    }
  }

  async getProducts(limit, page, sortOptions = {}, filter = {}) {
    try {
      const products = await Product.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)
        .lean();

      return products;
    } catch (error) {
      logger.error("Error al obtener productos:", error);
      throw error;
    }
  }

  async countProducts(filter = {}) {
    try {
      const count = await Product.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error al contar productos:", error);
      throw error;
    }
  }

  async updateProduct(productData) {
    try {
      const productId = productData.id;
      delete productData.id; // Remove ID from data to avoid updating it

      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true, runValidators: true });

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
      logger.error("Error updating product:", error);
      return { error: "Error updating product: " + error };
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
        logger.error("Product not found");
        return { error: "Product not found" };
      }

      if (!user.roles.includes("admin")) {
        return { error: "No tiene permiso para eliminar este producto" };
      }

      await Product.deleteOne({ _id: productId });
      logger.info("Product successfully deleted");
      return { status: "Producto eliminado correctamente" };
    } catch (error) {
      logger.error("Error deleting product:", error);
      return { error: "Error deleting product" };
    }
  }
}
