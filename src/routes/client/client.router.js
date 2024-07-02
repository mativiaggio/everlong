import { Router } from "express";
import { logger } from "../../utils/logger.js";
import ProductsController from "../../controllers/products.controller.js";
import UserController from "../../controllers/user.controller.js";

const productsController = new ProductsController();
const userController = new UserController();

// Constantes
import { clientSidebarItems } from "../../utils/constants.js";

const clientRouter = Router();

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

clientRouter.get("/", userMiddleware, async (req, res) => {
  const title = "Inicio";
  const description = "Bienvenido a everlong, tu comercio de confianza";
  const products = await productsController.findByFeatured();
  let user = null;
  if (req.user) {
    user = await userController.findById(req.user._id);
  }
  res.render("client/home", {
    user: user ? user.user : null,
    clientSidebarItems,
    title,
    description,
    products,
  });
});

clientRouter.get("/productos", userMiddleware, async (req, res) => {
  try {
    const title = "Productos";
    const description = "Listado de todos nuestros productos.";
    const screen = "products";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await productsController.getProducts(
      req,
      res,
      query,
      limit,
      page
    );
    const products = response.ResultSet;

    const totalProducts = await productsController.countProducts();
    const productsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }
    res.render("client/products", {
      user: user ? user.user : null,
      clientSidebarItems,
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

clientRouter.get("/registro", (req, res) => {
  const title = "Registro";
  const description =
    "Registrate en nuestra tienda para pasar a ser parte de esta gran familia.";
  const customClasses = "overflow-hidden";
  res.render("client/register", {
    title,
    description,
    customClasses,
    clientSidebarItems,
  });
});

clientRouter.get("/ingresar", (req, res) => {
  const title = "Iniciar sesión";
  const description =
    "Inicia sesión en tu cuenta para poder manejar tu carrito y finalizar la compra..";
  const customClasses = "overflow-hidden";
  res.render("client/login", {
    title,
    description,
    customClasses,
    clientSidebarItems,
  });
});

clientRouter.get("/carrito", async (req, res) => {
  const title = "Carrito";
  const description = "Aquí verás tus productos seleccionados.";
  let user;
  if (req.user) {
    user = await userController.findById(req.user._id);
  }
  res.render("client/cart", {
    user: user ? user.user : null,
    clientSidebarItems,
    title,
    description,
  });
});

export default clientRouter;
