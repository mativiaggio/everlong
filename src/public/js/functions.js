export function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function loadScripts() {
  const pagePath = window.location.pathname;

  let script;
  script = document.createElement("script");
  script.type = "module";

  const adminIndex = pagePath.indexOf("/admin");
  let page = adminIndex !== -1 ? pagePath.substring(adminIndex) : "";

  if (page.includes("/admin/categorias/editar")) {
    page = "/admin/categorias/editar";
  } else if (page.includes("/admin/productos/editar")) {
    page = "/admin/productos/editar";
  }

  switch (page) {
    case "/admin":
      script.src = "/js/admin/home.js";
      break;
    case "/admin/productos":
      script.src = "/js/admin/products.js";
      break;
    case "/admin/productos/agregar-producto":
      script.src = "/js/admin/admin-add-product.js";
      break;
    case "/admin/productos/editar":
      script.src = "/js/admin/admin-edit-product.js";
      break;
    case "/admin/categorias":
      script.src = "/js/admin/categories.js";
      break;
    case "/admin/categorias/editar":
      script.src = "/js/admin/admin-edit-category.js";
      break;
    case "/admin/usuarios":
      script.src = "/js/admin/users.js";
      break;
    case "/admin/ordenes-compra":
      script.src = "/js/admin/buying-orders.js";
      break;
    case "/admin/ingresos":
      script.src = "/js/admin/invoices.js";
      break;
    case "/admin/egresos":
      script.src = "/js/admin/receipts.js";
      break;
    case "/admin/empresa":
      script.src = "/js/admin/enterprise.js";
      break;
    default:
      // Handle cases where the page path doesn't match any of the expected admin paths
      console.error("Unknown admin page:", page);
      return;
  }

  document.body.appendChild(script);
}

export function contextAction(screen, action, reg_id) {
  switch (screen) {
    case "categories":
      switch (action) {
        case "edit":
          return `/admin/categorias/editar/${reg_id}`;
        case "delete":
          return `/admin/categorias/eliminar-categoria/${reg_id}`;
      }
      break;
    case "products":
      switch (action) {
        case "edit":
          return `/admin/productos/editar/${reg_id}`;
        case "delete":
          return `/admin/categorias/eliminar-categoria/${reg_id}`;
      }
      break;
  }
}
