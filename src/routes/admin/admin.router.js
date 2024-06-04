import { Router } from "express";
import { logger } from "../../utils/logger.js";
import UserController from "../../controllers/user.controller.js";

const router = Router();
const userController = new UserController();

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
  res.render("admin/home", { isLoggedIn: true });
});

router.get("/register", publicAccess, async (req, res) => {
  res.render("admin/register", { isLoggedIn: false });
});

router.get("/login", publicAccess, (req, res) => {
  res.render("admin/login", { isLoggedIn: false });
});

router.get("/login-fail", publicAccess, (req, res) => {
  res.render("admin/unauthorized");
});

router.get("/products", privateAccess, (req, res) => {
  res.render("admin/products");
});

export default router;
