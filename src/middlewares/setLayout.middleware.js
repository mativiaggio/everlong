/**
 * Middleware function to set the layout based on the requested path.
 *
 * @param {Request} req - The request object containing the path property.
 * @param {Response} res - The response object to which the layout property will be added.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} This function does not return anything.
 *
 * @example
 * // Example usage in Express.js app
 * app.use(setLayout);
 */
export function setLayout(req, res, next) {
  if (req.path.startsWith("/admin")) {
    res.locals.layout = "admin/main";
  } else {
    res.locals.layout = "client/main";
  }
  next();
}
