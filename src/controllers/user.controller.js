import UserDAO from "../dao/user.dao.js";
import { logger } from "../utils/logger.js";

const userDao = new UserDAO();

class UserController {
  async getAllAdmins() {
    try {
      const admins = await userDao.isThereAnAdmin();
      //   logger.info("admins from db: " + admins);

      if (admins.length === 0) {
        return { status: "error", message: "No admins in database" };
      }
      return { status: "success", admins: admins };
    } catch (error) {
      logger.error("Error getting admins:", error.message);
      throw error;
    }
  }
}

export default UserController;
