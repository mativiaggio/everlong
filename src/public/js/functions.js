export function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

$("table").on("click contextmenu", "tbody tr", function (e) {
  e.preventDefault(); // Para prevenir el comportamiento por defecto del click derecho

  let isActive = $(this).hasClass("active");

  // Remover la clase active de todas las filas
  $("table tbody tr").removeClass("active");

  // Si es un click normal, togllear la clase active
  if (e.type === "click") {
    $(this).toggleClass("active", !isActive);
  }
  // Si es un click derecho, añadir la clase active si no está activa
  else if (e.type === "contextmenu") {
    $(this).toggleClass("active", !isActive);
    rightClick(e, false);
  }
});

// Context Menu
$(document).on("click", hideMenu); // Si se hace ckick en cualquier parte de la pantalla, cierro el context menu.

let $menu = $("#contextMenu");

function hideMenu() {
  $menu.addClass("hidden").removeClass("block");
}

function showMenu() {
  $menu.addClass("block").removeClass("hidden");
}

// Muestro el context menu
function rightClick(e, boolean) {
  e.preventDefault();

  if ($menu.hasClass("block") && boolean) {
    hideMenu();
  } else {
    // Calcula las dimensiones del menú
    $menu.css("display", "block");
    const menuWidth = $menu.outerWidth();
    const menuHeight = $menu.outerHeight();
    $menu.css("display", "");

    // Calcula la posicion del menú
    let posX = e.pageX;
    let posY = e.pageY;

    // Verifica que no se pase del tamaño hotizontal total de la ventana
    if (posX + menuWidth > $(window).width()) {
      posX = $(window).width() - menuWidth;
    }

    // Verifica que no se pase del tamaño vertical total de la ventana
    if (posY + menuHeight > $(window).height()) {
      posY = $(window).height() - menuHeight;
    }

    // Aplica la posicion del menú
    $menu.css({
      left: posX + "px",
      top: posY + "px",
    });

    showMenu();
  }
}
