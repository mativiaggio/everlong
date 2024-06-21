$("#slug").on("input", function () {
  $(this).val(function (index, value) {
    return value.replace(/\s+/g, "-");
  });
});

$("#product-form").on("submit", function (e) {
  e.preventDefault();

  let required_flag = false;
  required_flag = $("#product-form").validateForm();

  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    // AQUI VA EL CODIGO DE ADD PRODUCT
    const productData = {
      id: $("#product-form").attr("reg_id"),
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

    const formElement = $(this)[0];
    const formData = new FormData(formElement);
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });

    fetch("/api/admin/products", {
      method: "PUT",
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
        window.location.href = "/admin/productos";
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error.message);
        alert(error.message);
      });
  }
});
