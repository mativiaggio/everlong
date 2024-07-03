import { Router } from "express";
import ProductsController from "../../../controllers/products.controller.js";
import UserController from "../../../controllers/user.controller.js";
import { logger } from "../../../utils/logger.js";
import upload from "../../../config/multer.config.js";

const clientProductsRouter = Router();
const productController = new ProductsController();
const userController = new UserController();
clientProductsRouter.get("/search", async (req, res) => {
  try {
    const findBy = req.query.findBy || "";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    console.log("Entro: " + findBy + " " + query);

    if (findBy !== "id") {
      const response = await productController.getProducts(
        req,
        res,
        query,
        limit,
        page
      );
      const products = response.ResultSet;

      const totalProducts = await productController.countProducts(query);
      const productsPerPage = 10;
      const totalPages = Math.ceil(totalProducts / productsPerPage);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      res.json({ products, pages });
    } else {
      console.log("Entramos al router: " + findBy + " " + query);
      const response = await productController.findById(query);
      const product = response;
      res.json({ product });
    }
  } catch (error) {
    logger.error("Error al buscar productos:", error);
    res.status(500).send("Error al buscar productos");
  }
});

export default clientProductsRouter;
