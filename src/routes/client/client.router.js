import { Router } from "express";
import ProductsController from "../../controllers/products.controller.js";

const productController = new ProductsController();

// Constantes
import { clientSidebarItems } from "../../utils/constants.js";

const router = Router();

// Middleware for public access
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");
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

const userMiddleware = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
};

router.get("/", userMiddleware, async (req, res) => {
  const title = "Inicio";
  const description = "Bienvenido a everlong, tu comercio de confianza";
  const product = await productController.findById("66807fc8afdfee027600c582");
  let products = [];
  products.push(product);
  console.log(products);
  res.render("client/home", {
    user: req.user,
    clientSidebarItems,
    title,
    description,
    products,
  });
});

export default router;
