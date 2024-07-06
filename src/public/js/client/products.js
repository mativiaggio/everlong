import { addToCart } from "../functions.js";

$("#product-open-sidebar").on("click", () => {
  $("#product-default-sidebar").removeClass("-translate-x-full");
});

$("#product-close-aside-button").on("click", () => {
  $("#product-default-sidebar").addClass("-translate-x-full");
});

$("#productSearchForm").on("submit", function (event) {
  event.preventDefault();
  debugger;
  const keywords = $("#productsSearchInput").val().trim();

  if (keywords) {
    const encodedKeywords = encodeURIComponent(keywords);
    window.location.href = `/productos/buscar/${encodedKeywords}`;
  }
});

$("button").click(function () {
  const productId = $(this).attr("data-product-id");
  if (productId) {
    addToCart(productId);
  }
});
