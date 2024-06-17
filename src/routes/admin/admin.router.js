import { Router } from "express";
import { logger } from "../../utils/logger.js";
import UserController from "../../controllers/user.controller.js";
import ProductsController from "../../controllers/products.controller.js";
import CategoriesController from "../../controllers/categories.controller.js";

const router = Router();
const userController = new UserController();
const productsController = new ProductsController();
const categoriesController = new CategoriesController();

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
  const admins = await userController.getAllAdmins();
  if (admins.status === "error") {
    res.render("admin/register");
  } else {
    res.render("admin/not-found");
  }
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
    const limit = req.query.limit || 10;
    const response = await productsController.getProducts(req, res, limit);
    const products = response.ResultSet;

    const totalProducts = await productsController.countProducts();
    const productsPerPage = 10;
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

router.get("/products/edit/:pslug", privateAccess, async (req, res) => {
  const title = "Editar Producto";
  const description = "Edita un producto de la base de datos";

  const productData = await productsController.findBySlug(req.params.pslug);
  console.log("Product in Router: ", productData);
  res.render("admin/edit-product", {
    isLoggedIn: true,
    title,
    description,
    productData,
  });
});

router.get("/categorias", privateAccess, async (req, res) => {
  try {
    const title = "Categorias";
    const description =
      "Visualiza, actualiza o elimina cualquiera de las categorias cargadas";
    const limit = req.query.limit || 5;
    const response = await categoriesController.getCategories(req, res, limit);
    const categories = response.ResultSet;

    const totalCategories = await categoriesController.countCategories();
    const categoriesPerPage = 10;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    logger.info("Categorias: " + categories + JSON.stringify(categories));
    res.render("admin/categories", {
      isLoggedIn: true,
      title,
      description,
      categories,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

export default router;
