import { Router } from "express";
import User from "../../../models/user.js";
import UserController from "../../../controllers/user.controller.js";
import { logger } from "../../../utils/logger.js";

const adminUserRouter = Router();
const userController = new UserController();

adminUserRouter.get("/users_stats", async (req, res) => {
  try {
    const userStats = await userController.getUserStats();
    res.json({ status: "success", data: userStats });
  } catch (error) {
    logger.error("Error getting user stats:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error getting user stats" });
  }
});

export default adminUserRouter;
