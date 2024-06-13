import UserDAO from "../dao/user.dao.js";
import { logger } from "../utils/logger.js";

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
