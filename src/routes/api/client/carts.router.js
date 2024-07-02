import { Router } from "express";
import CartController from "../../../controllers/cart.controller.js";
import ProductsController from "../../../controllers/products.controller.js";
import { logger } from "../../../utils/logger.js";

const clientCartRouter = Router();
const cartController = new CartController();
const productsController = new ProductsController();

clientCartRouter.post("/add-to-cart/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    let result;

    if (req.session.user) {
      // Si cartId existe, agregar el producto al carrito en la base de datos
      result = await cartController.addProductToCart(cartId, productId);
      res.json({ result });
    } else {
      const product = await productsController.findById(productId);
      res.status(200).json({
        status: "success",
        session: false,
        message: "User not logged in.",
        data: product,
      });
    }
  } catch (error) {
    logger.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error adding product to cart" });
  }
});
export default clientCartRouter;
