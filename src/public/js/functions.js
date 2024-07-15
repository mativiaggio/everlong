import { cartTotal } from "./components/cart/cartTotal.js";

export function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function loadScripts(level) {
  const pagePath = window.location.pathname;

  let script;
  script = document.createElement("script");
  script.type = "module";

  // const adminIndex = pagePath.indexOf("/admin");

  let index;
  if (level == "admin") {
    index = pagePath.indexOf("/admin");
  } else {
    index = pagePath.indexOf("/");
  }

  let page = index !== -1 ? pagePath.substring(index) : "";

  if (page.includes("/admin/categorias/editar")) {
    page = "/admin/categorias/editar";
  } else if (page.includes("/admin/productos/editar")) {
    page = "/admin/productos/editar";
  } else if (page.includes("/productos/buscar/")) {
    page = "/productos";
  }

  switch (page) {
    case "":
    case "/":
      script.src = "/js/client/home.js";
      break;
    case "/productos":
      script.src = "/js/client/products.js";
      break;
    case "/carrito":
      script.src = "/js/client/cart.js";
      break;
    case "/checkout":
      script.src = "/js/client/checkout.js";
      break;
    case "/ingresar":
      script.src = "/js/client/client-login.js";
      break;
    case "/registro":
      script.src = "/js/client/client-register.js";
      break;
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
    case "/admin/categorias/agregar-categoria":
      script.src = "/js/admin/admin-add-category.js";
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
      console.error("Unknown page:", page);
      return;
  }

  document.body.appendChild(script);
}

export function contextAction(screen, action, reg_id) {
  switch (screen) {
    case "products":
      switch (action) {
        case "edit":
          return `/admin/productos/editar/${reg_id}`;
        case "delete":
          return `/admin/productos/eliminar-categoria/${reg_id}`;
      }
      break;
    case "categories":
      switch (action) {
        case "edit":
          return `/admin/categorias/editar/${reg_id}`;
        case "delete":
          return `/admin/categorias/eliminar-categoria/${reg_id}`;
      }
      break;
    case "invoices":
      switch (action) {
        case "print":
          return `/admin/ingresos/imprimir/${reg_id}`;
        case "edit":
          return `/admin/ingresos/editar/${reg_id}`;
        case "delete":
          return `/admin/ingresos/eliminar-categoria/${reg_id}`;
      }
      break;
  }
}
export function addToCart(productId) {
  function addToLocalStorage(productData) {
    const { _id, price } = productData;

    let cart = JSON.parse(localStorage.getItem("cart")) || {
      products: [],
      total: 0,
    };

    const existingProductIndex = cart.products.findIndex(
      (product) => product.id === _id
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({
        id: _id,
        quantity: 1,
        price: price,
      });
    }

    cart.total += price;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  fetch(`/api/client/carts/add-to-cart/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
      if (!data.result.session) {
        addToLocalStorage(data.result.data);
      }
      toast({
        status: "success",
        message: "Producto agregado al carrito.",
      });
    })
    .catch((error) => {
      console.error("Error al agregar producto al carrito:", error.message);
      alert(error.message);
    });
}

export function toast(options = {}) {
  const {
    status = "success",
    message = "Operación realizada con éxito.",
    position = "bottom-end",
    timer = 3000,
  } = options;

  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: status,
    title: message,
  });
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

export function localCartHandler(productId, action) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  const updateCartTotal = () => {
    let newTotal = 0;
    cart.products.forEach((product) => {
      newTotal += product.quantity * product.price;
    });
    cart.total = newTotal;
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const findProductIndex = (id) => {
    return cart.products.findIndex((product) => product.id === id);
  };

  switch (action) {
    case "update":
      let updateIndex = findProductIndex(productId);
      if (updateIndex !== -1) {
        cart.products[updateIndex].quantity = $(
          `#quantity-${productId}`
        ).text();
        updateCartTotal();
        $("#total-container").html(cartTotal(cart));
        console.log("Updated cart:", cart);
      } else {
        console.log("Product not found");
      }
      break;
    case "delete":
      let deleteIndex = findProductIndex(productId);
      if (deleteIndex !== -1) {
        cart.products.splice(deleteIndex, 1);
        updateCartTotal();
        $("#total-container").html(cartTotal(cart));
        console.log("Updated cart:", cart);
      } else {
        console.log("Product not found");
      }
      break;
  }
}

export function checkUserLoggedIn() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.warn("Usuario no logueado.");
    localStorage.removeItem("userId");
    return;
  }

  fetch("/api/client/sessions/current")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("No user logged in");
      }
    })
    .then((data) => {
      console.log("Usuario logueado:", data.user);
    })
    .catch((error) => {
      console.error(error);
      localStorage.removeItem("userId");
    });
}
