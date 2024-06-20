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
