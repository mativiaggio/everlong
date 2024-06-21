const reg_id = $("#reg_id").val();
const parent_id = $("#parent_id").val();

$("#new-parent-id").find(`option[id="${reg_id}"]`).remove();
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

    debugger;
  }
});
