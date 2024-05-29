const loginForm = $("#loginForm");

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

  debugger;

  fetch("/api/admin/login", {
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
