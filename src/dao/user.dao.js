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

  /**
   * Retrieves the total number of users.
   *
   * @returns {Promise<Number>} A promise that resolves to the total number of users.
   */
  async getTotalUsers() {
    try {
      return await User.countDocuments();
    } catch (error) {
      logger.error("Error getting total users: ", error.message);
      throw error;
    }
  }

  /**
   * Retrieves the total number of admin users.
   *
   * @returns {Promise<Number>} A promise that resolves to the total number of admin users.
   */
  async getAdminUsersCount() {
    try {
      return await User.countDocuments({ roles: { $in: ["admin"] } });
    } catch (error) {
      logger.error("Error getting admin users count: ", error.message);
      throw error;
    }
  }

  // async getAllAdmins(limit, page) {
  //   try {
  //     const admins = await User.find()
  //       .limit(limit)
  //       .skip((page - 1) * limit)
  //       .lean();

  //     return admins;
  //   } catch (error) {
  //     logger.error("Error al obtener categorias:", error);
  //     throw error;
  //   }
  // }
  async getAllUsers(limit, page, sortOptions = {}, filter = {}) {
    try {
      // Prioritize users with the "admin" role
      const users = await User.aggregate([
        // {
        //   $addFields: {
        //     isAdmin: { $in: ["admin", "$roles"] },
        //   },
        // },
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
      logger.error("Error al obtener categorias:", error);
      throw error;
    }
  }
  async countUsers(filter) {
    try {
      const count = await User.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando administradores:", error);
      throw error;
    }
  }
}

export default UserDAO;
