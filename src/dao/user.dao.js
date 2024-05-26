import User from "../models/user.js";
import { logger } from "../utils/logger.js";

class UserDAO {
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).lean();
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error.message);
      throw error;
    }
  }

  async isThereAnAdmin() {
    try {
      const admins = await User.find({ roles: { $in: ["admin"] } });
      //   logger.info("admins from db: " + admins);
      return admins;
    } catch (error) {
      logger.error("Error checking for admins: ", error.message);
      throw error;
    }
  }
}

export default UserDAO;
