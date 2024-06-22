$("#slug").noSpace();

const id = $("#id").val();
const parent_id = $("#parent_id").val();

$("#new-parent-id").find(`option[id="${id}"]`).remove();
$("#new-parent-id").find(`option[id="${parent_id}"]`).attr("selected", true);

$("#category-form").on("submit", function (e) {
  e.preventDefault();

  let required_flag = $(this).validateForm();
  if (required_flag) {
    $("#required_message").removeClass("hidden").addClass("flex");
  } else {
    const formElement = $(this)[0];
    const formData = new FormData(formElement);
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });

    obj.parent = obj["new-parent-id"];
    delete obj["new-parent-id"];

    fetch("/api/admin/categories", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then(async (response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          const data = await response.json();
          console.error("Response data:", data);
          throw new Error(data.error || "Unknown error");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "/admin/categorias";
      })
      .catch((error) => {
        console.error("Error al agregar el categoría:", error.message);
        alert(error.message);
      });
  }
});
