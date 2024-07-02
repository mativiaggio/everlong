import Product from "../models/product.js";
import Cart from "../models/cart.js";

export default class CartsDAO {
  // Crea un carrito con los productos proporcionados
  async createCart(products) {
    try {
      const productsWithQuantity = products.map((productId) => ({
        id: productId,
        quantity: 1,
      }));

      const cart = new Cart({
        products: productsWithQuantity,
      });

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error.message);
      throw error;
    }
  }

  // Obtiene un carrito por su ID
  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).lean();
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error.message);
      throw error;
    }
  }

  // Obtiene un carrito por el ID de usuario
  async getCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ user: userId });
      return cart;
    } catch (error) {
      console.error("Error getting cart by user ID:", error.message);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        console.error("Cart not found");
        return { error: "Cart not found" };
      }

      const existingProduct = cart.products.find(
        (product) => product.id === productId
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        // Aquí asumimos que el producto tiene un precio almacenado en la base de datos
        const product = await Product.findById(productId);
        cart.products.push({
          id: productId,
          quantity: 1,
          price: product.price,
        });
      }

      await this.calculateAndUpdateTotal(cart); // Llama al método para calcular y actualizar el total
      return existingProduct || { id: productId, quantity: 1 };
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        console.error("Cart not found");
        return { error: "Cart not found" };
      }

      const existingProduct = cart.products.find(
        (product) => product.id.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity = quantity;
        await this.calculateAndUpdateTotal(cart); // Llama al método para calcular y actualizar el total
        await cart.save();
        return cart;
      } else {
        console.error("Product not found in the cart");
        return { error: "Product not found in the cart" };
      }
    } catch (error) {
      console.error("Error updating product quantity:", error.message);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        console.error("Cart not found");
        return { error: "Cart not found" };
      }

      const indexToRemove = cart.products.findIndex(
        (product) => product.id.toString() === productId
      );

      if (indexToRemove !== -1) {
        cart.products.splice(indexToRemove, 1);
        await this.calculateAndUpdateTotal(cart); // Llama al método para calcular y actualizar el total
        await cart.save();
        return { message: "Product removed from cart" };
      } else {
        console.error("Product not found in the cart");
        return { error: "Product not found in the cart" };
      }
    } catch (error) {
      console.error("Error removing product from cart:", error.message);
      throw error;
    }
  }

  async calculateAndUpdateTotal(cart) {
    try {
      let total = 0;
      for (const product of cart.products) {
        // Aquí asumimos que cada producto tiene un precio y una cantidad
        const productData = await Product.findById(product.id);
        total += productData.price * product.quantity;
      }
      cart.total = total;
      await cart.save();
    } catch (error) {
      console.error("Error calculating and updating total:", error.message);
      throw error;
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        console.error("Cart not found");
        return { error: "Cart not found" };
      }

      cart.products = [];
      cart.total = 0;
      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error emptying cart:", error.message);
      throw error;
    }
  }
}
