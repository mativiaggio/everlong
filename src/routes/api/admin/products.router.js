import { Router } from "express";
import ProductsController from "../../../controllers/products.controller.js";

const adminProductsRouter = Router();
const productController = new ProductsController();

adminProductsRouter.post("/", async (req, res) => {
  try {
    await productController.addProduct(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default adminProductsRouter;
