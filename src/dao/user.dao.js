import User from "../models/user.js";
import { logger } from "../utils/logger.js";

class UserDAO {
  /**
   * Retrieves a user from the database by their ID.
   *
   * @param {string} userId - The unique identifier of the user to retrieve.
   * @returns {Promise<Object>} A promise that resolves to the user object if found, or rejects with an error.
   * @throws {Error} If an error occurs while retrieving the user.
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).lean();
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error.message);
      throw error;
    }
  }

  /**
   * Checks if there is at least one admin user in the database.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of admin user objects if found, or rejects with an error.
   * @throws {Error} If an error occurs while checking for admins.
   */
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
