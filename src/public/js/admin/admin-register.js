const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(registerForm);

  let obj = {};
  data.forEach((value, key) => (obj[key] = value));

  obj = { ...obj, roles: ["admin"] };

  fetch("/api/admin/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 200) {
        window.location.replace("/admin/login");
      } else {
        res.json().then((data) => {
          console.error("Registration failed:", data);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
});
