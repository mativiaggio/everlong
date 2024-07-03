import { cartItem } from "../components/cart/cartItem.js";
import { cartTotal } from "../components/cart/cartTotal.js";
import { localCartHandler, toast } from "../functions.js";

if (localStorage.getItem("token")) {
  fetch(`/api/client/carts/${localStorage.getItem("userId")}`)
    .then((response) => response.json())
    .then((data) => {
      $("#total-container").html(cartTotal(data));
      const productData = data.products;
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
            $("#total-container").html(cartTotal(data));
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
            $("#total-container").html(cartTotal(data));
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
    const productPromises = localCart.products.map(async (product) => {
      return fetch(`/api/client/products/search?findBy=id&query=${product.id}`)
        .then((response) => response.json())
        .then((data) => {
          const productData = data.product;
          productData.quantity = product.quantity;
          return cartItem(productData);
        })
        .catch((error) => {
          console.error("Error:", error);
          return "";
        });
    });

    return Promise.all(productPromises);
  }

  async function refreshCards() {
    const cards = await getProducts();
    $("#cards-container").html(cards.join(""));
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
        $("#total-container").html(cartTotal(localCart));
      }
    });
  });
}
