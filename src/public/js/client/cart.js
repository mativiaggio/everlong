if (localStorage.getItem("token")) {
  alert("Con sesion");
} else {
  const localCart = JSON.parse(localStorage.getItem("cart"));

  (async function () {
    const productPromises = localCart.products.map((product) => {
      return fetch(`/api/client/products/search?findBy=id&query=${product.id}`)
        .then((response) => response.json())
        .then((data) => {
          debugger;
          const productData = data.product;
          return `
          <div class="card">
            <img src="${productData.images[0]}" alt="${productData.title}">
            <h5>${productData.title}</h5>
            <p>$${productData.price}</p>
          </div>
        `;
        })
        .catch((error) => {
          console.error("Error:", error);
          return "";
        });
    });

    const cards = await Promise.all(productPromises);
    $("#cards-container").append(cards.join(""));
  })();
}
