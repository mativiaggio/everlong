import { addToCart } from "../functions.js";

$("#carousel-container").simpleCarousel({
  classes: "relative h-[30vh] md:h-[60vh]",
  items: ["https://images.unsplash.com/photo-1616876195047-522271be4e66?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1509741102003-ca64bfe5f069?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1608547492806-7e6c70ffdea4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
});

$("button.addToCart").click(function () {
  const productId = $(this).attr("data-product-id");
  if (productId) {
    addToCart(productId);
  }
});
