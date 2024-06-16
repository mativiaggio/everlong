$("#slug").on("input", function () {
  $(this).val(function (index, value) {
    return value.replace(/\s+/g, "-");
  });
});

$("#edit-product-button").on("click", function (e) {
  e.preventDefault();
  let required_flad = false;
  $("#product-form")
    .find("input")
    .each(function () {
      if (
        ($(this).attr("type") === "text" && $(this).val() === "") ||
        ($(this).attr("type") === "number" &&
          ($(this).val() === "0" || $(this).val() === ""))
      ) {
        if ($(this).attr("id") === "price") {
          $(this).closest("div").addClass("input-tiene-error");
          required_flad = true;
        } else {
          $(this).addClass("input-tiene-error");
          required_flad = true;
        }
      } else {
        $(this).removeClass("input-tiene-error");

        if ($(this).attr("id") === "price") {
          $(this).closest("div").removeClass("input-tiene-error");
        } else {
          $(this).removeClass("input-tiene-error");
        }
      }
    });

  if (required_flad) {
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
    debugger;
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
        window.location.href = "/admin/products";
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error.message);
        alert(error.message);
      });
  }
});
