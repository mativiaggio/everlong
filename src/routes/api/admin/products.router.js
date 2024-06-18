import { Router } from "express";
import ProductsController from "../../../controllers/products.controller.js";
import UserController from "../../../controllers/user.controller.js";

const adminProductsRouter = Router();
const productController = new ProductsController();
const userController = new UserController();

// Middleware for public access
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/admin");
  next();
};

// Middleware for private access
const privateAccess = async (req, res, next) => {
  if (!req.session.user) {
    const users = await userController.isThereAnAdmin();

    if (users.status == "error") {
      logger.error(users.message);
      return res.redirect("/admin/register");
    } else {
      return res.redirect("/admin/login");
    }
  }
  next();
};

adminProductsRouter.post("/", privateAccess, async (req, res) => {
  try {
    if (req.body.id) {
      await productController.updateProduct(req, res);
    } else {
      await productController.addProduct(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProductsRouter.delete("/:pid", async (req, res) => {
  try {
    await productController.deleteProduct(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProductsRouter.get("/products_stats", privateAccess, async (req, res) => {
  try {
    await productController.getProductStats(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default adminProductsRouter;
