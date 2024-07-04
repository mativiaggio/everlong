import { cartIsEmpty } from "../components/cart/cartIsEmpty.js";
import { cartItem } from "../components/cart/cartItem.js";
import { cartTotal } from "../components/cart/cartTotal.js";
import { localCartHandler, toast } from "../functions.js";

if (localStorage.getItem("userId")) {
  fetch(`/api/client/carts/${localStorage.getItem("userId")}`)
    .then((response) => response.json())
    .then((data) => {
      $("#total-container").html(cartTotal(data));
      const productData = data.products;

      if (productData.length > 0) {
        productData.forEach(function (product) {
          fetch(`/api/client/products/search?findBy=id&query=${product.id}`)
            .then((response) => response.json())
            .then((data) => {
              const productData = data.product;
              productData.quantity = product.quantity;
              const card = cartItem(productData);
              $("#cards-container").append(card);
            })
            .catch((error) => {
              console.error("Error:", error);
              return "";
            });
        });
      } else {
        $("#cards-container").append(cartIsEmpty());
      }

      // Use event delegation for dynamically added elements
      $(document).on("click", ".addOne", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).attr("data-button");
        increment(productId);
      });

      $(document).on("click", ".removeOne", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).attr("data-button");
        if (parseInt($(`#quantity-${productId}`).text()) > 1) {
          decrement(productId);
        }
      });

      $(document).on("click", ".deleteButton", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = $(this).attr("data-button");
        deleteProduct(productId);
      });

      function increment(productId) {
        let quantity = parseInt($(`#quantity-${productId}`).text()) + 1;
        $(`#quantity-${productId}`).text(quantity);

        fetch(`/api/client/carts/update-quantity/${productId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity: quantity }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            $("#total-container").html(cartTotal(data.result));
          });
      }

      function decrement(productId) {
        let quantity = parseInt($(`#quantity-${productId}`).text()) - 1;
        $(`#quantity-${productId}`).text(quantity);

        fetch(`/api/client/carts/update-quantity/${productId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity: quantity }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            $("#total-container").html(cartTotal(data.result));
          });
      }

      function deleteProduct(productId) {
        fetch(`/api/client/carts/remove-product/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            $(`#product-card-${productId}`).remove();
            if (data.result.products.length < 1) {
              $("#cards-container").append(cartIsEmpty());
            }
            $("#total-container").html(cartTotal(data.result));
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return "";
    });
} else {
  const localCart = JSON.parse(localStorage.getItem("cart"));

  async function getProducts() {
    if (localCart) {
      if (localCart.products.length > 0) {
        const productPromises = localCart.products.map(async (product) => {
          try {
            const response = await fetch(`/api/client/products/search?findBy=id&query=${product.id}`);
            const data = await response.json();
            const productData = data.product;
            productData.quantity = product.quantity;
            return cartItem(productData);
          } catch (error) {
            console.error("Error:", error);
            return "";
          }
        });

        const products = await Promise.all(productPromises);
        return products.join("");
      } else {
        return cartIsEmpty();
      }
    } else {
      return cartIsEmpty();
    }
  }

  async function refreshCards() {
    const cards = await getProducts();
    $("#cards-container").html(cards);
  }

  $("#total-container").html(cartTotal(localCart));

  $(document).ready(async function () {
    await refreshCards();
    $(`.addOne, .removeOne, .deleteButton`).on("click", async function () {
      const dataId = $(this).attr("data-button");
      const actualQ = parseInt($(`#quantity-${dataId}`).text(), 10);
      if ($(this).hasClass("addOne")) {
        $(`#quantity-${dataId}`).text(actualQ + 1);
        localCartHandler(dataId, "update");
      } else if ($(this).hasClass("removeOne") && actualQ > 1) {
        $(`#quantity-${dataId}`).text(actualQ - 1);
        localCartHandler(dataId, "update");
      } else if ($(this).hasClass("deleteButton")) {
        $(`#product-card-${dataId}`).remove();
        localCartHandler(dataId, "delete");
        toast({ status: "success", message: "Producto eliminado del carrito" });
        const localCart = JSON.parse(localStorage.getItem("cart"));

        if (localCart.products.length <= 0) {
          $("#cards-container").html(cartIsEmpty());
        }
        $("#total-container").html(cartTotal(localCart));
      }
    });
  });
}
