const date = new Date();
const formattedDate = date.toISOString().split("T")[0];
$("#published_date").val(formattedDate);

$("#add-product-button").on("click", function (e) {
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
    debugger;
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        alert("Producto agregado correctamente!");
        // window.location.href = "/admin/products";
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error);
        alert(
          "Hubo un error al agregar el producto. Por favor, inténtalo de nuevo."
        );
      });
  }
});
