const date = new Date();
const formattedDate = date.toISOString().split("T")[0];
$("#publishedOn").val(formattedDate);

$("#slug").noSpace();

$("#dropzone-file").on("change", function () {
  const files = this.files;
  $("#image-preview").empty();
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("h-32", "w-32", "object-cover", "mr-2", "mb-2");
      $("#image-preview").append(img);
    };
    reader.readAsDataURL(files[i]);
  }
});

$("#add-product-button").on("click", function (e) {
  e.preventDefault();
  let required_flag = $("#product-form").validateForm();

  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    // // AQUI VA EL CODIGO DE ADD PRODUCT
    // const productData = {
    //   title: $("#title").val(),
    //   slug: $("#slug").val(),
    //   publishedOn: $("#publishedOn").val(),
    //   brand: $("#brand").val(),
    //   price: $("#price").val(),
    //   category: $("#category").val(),
    //   stock: $("#stock").val(),
    //   description: $("#description").val(),
    //   _status: "active",
    // };

    // const files = $("#dropzone-file")[0].files;
    // const images = [];
    // for (let i = 0; i < files.length; i++) {
    //   images.push(files[i]);
    // }

    // productData.images = images;
    // debugger;

    // fetch("/api/admin/products", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(productData),
    // })
    //   .then(async (response) => {
    //     if (!response.ok) {
    //       const data = await response.json();
    //       throw data;
    //     }
    //   })

    //   .then((data) => {
    //     window.location.href = "/admin/productos";
    //   })
    //   .catch((error) => {
    //     console.error("Error al agregar el producto:", error.message);
    //     alert(error.message);
    //   });
    const formData = new FormData();
    formData.append("title", $("#title").val());
    formData.append("slug", $("#slug").val());
    formData.append("publishedOn", $("#publishedOn").val());
    formData.append("brand", $("#brand").val());
    formData.append("price", $("#price").val());
    formData.append("category", $("#category").val());
    formData.append("stock", $("#stock").val());
    formData.append("description", $("#description").val());
    formData.append("_status", "active");

    const files = $("#dropzone-file")[0].files;
    for (let i = 0; i < files.length; i++) {
      formData.append("productImages", files[i]);
    }

    fetch("/api/admin/products", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data;
        }
        return response.json();
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
