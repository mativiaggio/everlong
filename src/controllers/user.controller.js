import UserDAO from "../dao/user.dao.js";
import { logger } from "../utils/logger.js";
import { sortUsers } from "../utils/functions.js";

const userDao = new UserDAO();

class UserController {
  /**
   * Retrieves all admins from the database.
   *
   * @returns {Promise<{status: string, admins: Array} | {status: string, message: string}>}
   * - A promise that resolves to an object with 'status' as 'success' and 'admins' as an array of admin objects.
   * - If no admins are found, resolves to an object with 'status' as 'error' and 'message' as 'No admins in database'.
   * - If an error occurs during the process, rejects the promise with the error.
   */
  async isThereAnAdmin() {
    try {
      const admins = await userDao.isThereAnAdmin();
      if (admins.length === 0) {
        return { status: "error", message: "No admins in database" };
      }
      return { status: "success", admins: admins };
    } catch (error) {
      logger.error("Error getting admins:", error.message);
      throw error;
    }
  }

  async getAllUsers(req, res, limit) {
    try {
      const { page = 1, sort, query } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (query) {
      }

      const sortOptions = {};
      if (sort) {
      }

      const users = await userDao.getAllUsers(limit, page, sortOptions, filter);
      const sortedUsers = sortUsers(users);
      const totalUsers = await userDao.countUsers(filter);
      const totalPages = Math.ceil(totalUsers / limit);

      const result = {
        status: "success",
        ResultSet: sortedUsers,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/users?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/users?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /users route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * Retrieves statistics of the users.
   *
   * @returns {Promise<Object>} A promise that resolves to an object with user statistics.
   */
  async getUserStats() {
    try {
      const totalUsers = await userDao.getTotalUsers();
      const adminUsers = await userDao.getAdminUsersCount();
      const customerUsers = totalUsers - adminUsers;

      return { totalUsers, adminUsers, customerUsers };
    } catch (error) {
      logger.error("Error getting user stats:", error.message);
      throw error;
    }
  }

  async countUsers() {
    try {
      const totalAdmins = await userDao.countUsers();
      return totalAdmins;
    } catch (error) {
      logger.error("Error counting users:", error);
      throw error;
    }
  }
}

export default UserController;
