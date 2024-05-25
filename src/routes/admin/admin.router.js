import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("admin/home");
});

export default router;
