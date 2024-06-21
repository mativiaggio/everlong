import { Router } from "express";
import { logger } from "../../utils/logger.js";
import UserController from "../../controllers/user.controller.js";
import ProductsController from "../../controllers/products.controller.js";
import CategoriesController from "../../controllers/categories.controller.js";
import BuyingOrdersController from "../../controllers/buyingOrders.controller.js";
import InvoicesController from "../../controllers/invoices.controller.js";
import ReceiptsController from "../../controllers/receipts.controller.js";
import EnterpriseController from "../../controllers/enterprise.controller.js";

// Constantes
import {
  adminSidebarItems,
  user_context,
  categories_context,
  basic_print_edit_delete,
} from "../../utils/constants.js";

const router = Router();
const userController = new UserController();
const productsController = new ProductsController();
const categoriesController = new CategoriesController();
const buyingOrdersController = new BuyingOrdersController();
const invoicesController = new InvoicesController();
const receiptsController = new ReceiptsController();
const enterpriseController = new EnterpriseController();

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

router.get("/", privateAccess, (req, res) => {
  const title = "Inicio";
  const description = "Este es el admin panel de Everlong";
  res.render("admin/home", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
  });
});

router.get("/register", publicAccess, async (req, res) => {
  const admins = await userController.isThereAnAdmin();
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

router.get("/productos", privateAccess, async (req, res) => {
  try {
    const title = "Productos";
    const description =
      "Visualiza, actualiza o elimina cualquiera de los productos cargados";
    const screen = "products";
    const limit = req.query.limit || 10;
    const response = await productsController.getProducts(req, res, limit);
    const products = response.ResultSet;

    const totalProducts = await productsController.countProducts();
    const productsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/products", {
      isLoggedIn: true,
      adminSidebarItems,
      screen,
      contextMenu,
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

router.get("/productos/agregar-producto", privateAccess, (req, res) => {
  const title = "Agregar Producto";
  const description = "Agrega un producto nuevo a la base de datos";
  res.render("admin/add-product", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
  });
});

router.get("/productos/editar/:pslug", privateAccess, async (req, res) => {
  const title = "Editar Producto";
  const description = "Edita un producto de la base de datos";

  const productData = await productsController.findBySlug(req.params.pslug);
  console.log(productData);
  res.render("admin/edit-product", {
    isLoggedIn: true,
    adminSidebarItems,
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
    const screen = "categories";
    const limit = req.query.limit || 5;
    const response = await categoriesController.getCategories(req, res, limit);
    const categories = response.ResultSet;

    const totalCategories = await categoriesController.countCategories();
    const categoriesPerPage = 10;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = categories_context;
    res.render("admin/categories", {
      isLoggedIn: true,
      adminSidebarItems,
      screen,
      contextMenu,
      title,
      description,
      categories,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener categorias:", error);
    res.status(500).send("Error al obtener categorias");
  }
});

router.get("/categorias/editar/:pslug", privateAccess, async (req, res) => {
  try {
    const title = "Editar Producto";
    const description = "Edita un producto de la base de datos";

    const categoryData = await categoriesController.findBySlug(
      req.params.pslug
    );

    const categories = await categoriesController.getAll();

    res.render("admin/edit-categories", {
      isLoggedIn: true,
      adminSidebarItems,
      title,
      description,
      categoryData,
      categories,
    });
  } catch (error) {
    logger.error("Error al obtener categoria:", error);
    res.status(500).send("Error al obtener categorias");
  }
});

router.get("/usuarios", privateAccess, async (req, res) => {
  try {
    const title = "Usuarios";
    const description = "Visualiza, actualiza o elimina usuarios cargados";
    const limit = req.query.limit || 10;
    const response = await userController.getAllUsers(req, res, limit);
    const admins = response.ResultSet;

    const totalAdmins = await userController.countUsers();
    const adminsPerPage = 10;
    const totalPages = Math.ceil(totalAdmins / adminsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = user_context;
    res.render("admin/users", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      admins,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al obtener usuarios");
  }
});

router.get("/ordenes-compra", privateAccess, async (req, res) => {
  try {
    const title = "Ordenes de Compra";
    const description =
      "Visualiza, actualiza o elimina las ordenes de compra cargadas";
    const limit = req.query.limit || 10;
    const response = await buyingOrdersController.getAllBuyingOrders(
      req,
      res,
      limit
    );
    const buyingOrders = response.ResultSet;
    const totalBuyingOrders = await buyingOrdersController.countBuyingOrders();
    const buyingOrdersPerPage = 10;
    const totalPages = Math.ceil(totalBuyingOrders / buyingOrdersPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/buyingOrders", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      buyingOrders,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener egresos:", error);
    res.status(500).send("Error al obtener egresos");
  }
});

router.get("/ingresos", privateAccess, async (req, res) => {
  try {
    const title = "Ingresos";
    const description =
      "Visualiza, actualiza o elimina las facturas de compra cargadas";
    const limit = req.query.limit || 10;
    const response = await invoicesController.getAllInvoices(req, res, limit);
    const invoices = response.ResultSet;

    console.log(invoices);

    const totalInvoices = await invoicesController.countInvoices();
    const invoicesPerPage = 10;
    const totalPages = Math.ceil(totalInvoices / invoicesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/invoices", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      invoices,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener ingresos:", error);
    res.status(500).send("Error al obtener ingresos");
  }
});

router.get("/egresos", privateAccess, async (req, res) => {
  try {
    const title = "Egresos";
    const description =
      "Visualiza, actualiza o elimina las facturas de venta cargadas";
    const limit = req.query.limit || 10;
    const response = await receiptsController.getAllReceipts(req, res, limit);
    const receipts = response.ResultSet;

    console.log(receipts);

    const totalReceipts = await receiptsController.countReceipts();
    const receiptsPerPage = 10;
    const totalPages = Math.ceil(totalReceipts / receiptsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/receipts", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      receipts,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener egresos:", error);
    res.status(500).send("Error al obtener egresos");
  }
});

router.get("/empresa", privateAccess, async (req, res) => {
  const title = "Empresa";
  const description = "Editar Información de la empresa";

  const data = await enterpriseController.getEnterpriseData();
  const enterpriseData = data[0].toJSON();
  console.log(enterpriseData);
  res.render("admin/enterprise", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
    enterpriseData,
  });
});

export default router;
