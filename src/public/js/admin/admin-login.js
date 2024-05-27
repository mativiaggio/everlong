$(document).ready(function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);

    debugger;
    $("#submit").prop("disabled", true);

    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });

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
});
