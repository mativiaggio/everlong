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

  async getTotalUsers() {
    try {
      return await User.countDocuments();
    } catch (error) {
      logger.error("Error getting total users: ", error.message);
      throw error;
    }
  }

  async getAdminUsersCount() {
    try {
      return await User.countDocuments({ roles: { $in: ["admin"] } });
    } catch (error) {
      logger.error("Error getting admin users count: ", error.message);
      throw error;
    }
  }
  async getAllUsers(limit, page, sortOptions = {}, filter = {}) {
    try {
      // Prioritize users with the "admin" role
      const users = await User.aggregate([
        {
          $sort: {
            isAdmin: -1,
            ...sortOptions,
          },
        },
        {
          $match: filter,
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]).exec();

      return users;
    } catch (error) {
      logger.error("Error getting all users", error);
      throw error;
    }
  }
  async countUsers(filter) {
    try {
      const count = await User.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error counting admin users", error);
      throw error;
    }
  }
}

export default UserDAO;
