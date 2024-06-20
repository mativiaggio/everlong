export function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function loadScripts() {
  const page = window.location.pathname.split("/").pop();

  let script;
  script = document.createElement("script");
  script.type = "module";

  switch (page) {
    case "admin":
      script.src = "/js/admin/home.js";
      document.body.appendChild(script);
      break;
    case "productos":
      script.src = "/js/admin/products.js";
      document.body.appendChild(script);
      break;
    case "categorias":
      script.src = "/js/admin/categories.js";
      document.body.appendChild(script);
      break;
    case "usuarios":
      script.src = "/js/admin/users.js";
      document.body.appendChild(script);
      break;
    case "ordenes-compra":
      script.src = "/js/admin/buying-orders.js";
      document.body.appendChild(script);
      break;
    case "ingresos":
      script.src = "/js/admin/invoices.js";
      document.body.appendChild(script);
      break;
    case "egresos":
      script.src = "/js/admin/receipts.js";
      document.body.appendChild(script);
      break;
    case "empresa":
      script.src = "/js/admin/enterprise.js";
      document.body.appendChild(script);
      break;
  }
}
