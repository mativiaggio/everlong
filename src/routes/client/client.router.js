import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("client/home");
});

router.get("/test", (req, res) => {
  res.json({ test: "test" });
});

export default router;
