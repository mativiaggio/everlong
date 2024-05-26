import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("client/home");
});

export default router;
