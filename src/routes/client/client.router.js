import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const title = "Tienda Virtual";
  res.render("client/home", { title });
});

router.get("/sobre-nosotros", (req, res) => {
  res.render("client/about-us");
});

export default router;
