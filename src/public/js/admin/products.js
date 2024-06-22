$("#searchInput").on("blur change", function (e) {
  e.preventDefault();
  const query = this.value;
  fetch(`/api/admin/products/search?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("products_tbody");
      tbody.innerHTML = "";

      data.products.forEach((product) => {
        console.log(product);
        const row = document.createElement("tr");
        row.className =
          "even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)] cursor-pointer";
        row.id = product.slug;
        row.innerHTML = `
          <td scope="row" class="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${
            product.title
          }</td>
          <td class="px-2 py-2">${product.category || ""}</td>
          <td class="px-2 py-2">$${product.price}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error:", error));
});

$("table").contextMenuPlugin({
  menuSelector: "#contextMenu",
});

$(".edit_button").on("click", function () {
  window.location.replace(`/admin/products/edit/${$(this).attr("slug")}`);
});
$(".delete_button").on("click", function () {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Estás a punto de borrar este producto. Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/admin/products/${$(this).attr("id")}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          switch (res.status) {
            case 500:
              alert("Error: " + res.status);
              break;
            case 200:
              window.location.reload();
              break;
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });
});
