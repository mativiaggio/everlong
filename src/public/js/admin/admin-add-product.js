const date = new Date();
const formattedDate = date.toISOString().split("T")[0];
$("#published_date").val(formattedDate);

$("#slug").noSpace();

$("#add-product-button").on("click", function (e) {
  e.preventDefault();
  let required_flag = $("#product-form").validateForm();

  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    // AQUI VA EL CODIGO DE ADD PRODUCT
    const productData = {
      title: $("#name").val(),
      slug: $("#slug").val(),
      publishedOn: $("#published_date").val(),
      brand: $("#brand").val(),
      price: $("#price").val(),
      category: $("#category").val(),
      stock: $("#stock").val(),
      description: $("#description").val(),
      _status: "active",
    };

    fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data;
        }
      })

      .then((data) => {
        alert("Producto agregado correctamente!");
        // window.location.href = "/admin/products";
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error.message);
        alert(error.message);
      });
  }
});
