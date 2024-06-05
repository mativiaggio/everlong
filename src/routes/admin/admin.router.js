import { Router } from "express";
import { logger } from "../../utils/logger.js";
import UserController from "../../controllers/user.controller.js";
import ProductsController from "../../controllers/products.controller.js";

const router = Router();
const userController = new UserController();
const productsController = new ProductsController();

// Middleware for public access
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/admin");
  next();
};

// Middleware for private access
const privateAccess = async (req, res, next) => {
  if (!req.session.user) {
    const users = await userController.getAllAdmins();

    if (users.status == "error") {
      logger.error(users.message);
      return res.redirect("/admin/register");
    } else {
      return res.redirect("/admin/login");
    }
  }
  next();
};

router.get("/", privateAccess, (req, res) => {
  const title = "Inicio";
  const description = "Este es el admin panel de Everlong";
  res.render("admin/home", { isLoggedIn: true, title, description });
});

router.get("/register", publicAccess, async (req, res) => {
  const title = "Register";
  const description = "Registra un nuevo usuario administrador en Everlong";
  res.render("admin/register", { isLoggedIn: false, title, description });
});

router.get("/login", publicAccess, (req, res) => {
  const title = "Login";
  const description =
    "Inicia sesion en el panel administrador de Everlong para comenzar a manejar tu negocio";
  res.render("admin/login", { isLoggedIn: false, title, description });
});

router.get("/login-fail", publicAccess, (req, res) => {
  const title = "No Autorizado";
  const description = "Usuario no autorizado en el panel administrador";
  res.render("admin/unauthorized", { title, description });
});

router.get("/products", privateAccess, async (req, res) => {
  try {
    const title = "Productos";
    const description =
      "Visualiza, actualiza o elimina cualquiera de los productos cargados";
    const limit = req.query.limit || 5;
    const response = await productsController.getProducts(req, res, limit);
    const products = response.ResultSet;

    const totalProducts = await productsController.countProducts();
    const productsPerPage = 5;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    res.render("admin/products", {
      isLoggedIn: true,
      title,
      description,
      products,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

router.get("/products/add-product", privateAccess, (req, res) => {
  const title = "Agregar Producto";
  const description = "Agrega un producto nuevo a la base de datos";
  res.render("admin/add-product", {
    isLoggedIn: true,
    title,
    description,
  });
});

export default router;
