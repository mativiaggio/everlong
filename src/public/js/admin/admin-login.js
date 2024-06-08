import { isValidEmail } from "../functions.js";
const loginForm = $("#loginForm");

$("#submit").prop("disabled", true).css({
  opacity: 0.5,
  cursor: "not-allowed",
});

$("#password, #email").on("input propertychanges", function () {
  const email = $("#email").val();
  const password = $("#password").val();

  const valid_email = isValidEmail(email);

  if (password !== "" && valid_email) {
    $("#submit").prop("disabled", false).css({
      opacity: 1,
      cursor: "pointer",
    });
  } else {
    $("#submit").prop("disabled", true).css({
      opacity: 0.5,
      cursor: "not-allowed",
    });
  }
});

loginForm.on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();

  const formElement = loginForm[0];
  const formData = new FormData(formElement);

  $("#submit").prop("disabled", true);

  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });

  fetch("/api/admin/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      switch (res.status) {
        case 401:
          window.location.replace("/admin/login-fail");
          break;
        case 200:
          window.location.replace("/admin");
          break;
      }
    })
    .catch((error) => console.error("Error:", error));
});
