import { contextAction } from "./functions.js";

(function ($) {
  $.fn.contextMenuPlugin = function (options) {
    var settings = $.extend(
      {
        menuSelector: "#contextMenu",
      },
      options
    );

    let $menu = $(settings.menuSelector);

    function hideMenu() {
      $menu.addClass("hidden").removeClass("block");
    }

    function showMenu() {
      $menu.addClass("block").removeClass("hidden");
    }

    function rightClick(e, boolean) {
      e.preventDefault();

      if ($menu.hasClass("block") && boolean) {
        hideMenu();
      } else {
        $menu.css("display", "block");
        const menuWidth = $menu.outerWidth();
        const menuHeight = $menu.outerHeight();
        $menu.css("display", "");

        let posX = e.pageX;
        let posY = e.pageY;

        if (posX + menuWidth > $(window).width()) {
          posX = $(window).width() - menuWidth;
        }
        if (posY + menuHeight > $(window).height()) {
          posY = $(window).height() - menuHeight;
        }

        $menu.css({
          left: posX + "px",
          top: posY + "px",
        });

        showMenu();
      }
    }

    return this.each(function () {
      var $table = $(this);
      var table_id = $table.attr("id");

      if (!table_id) {
        console.error(
          "ERROR: Table not found... \nPlease verify that the table exists and that the table has a valid id."
        );
      } else {
        console.info("Contextmenu plugin loaded successfully");
        $table.on("click contextmenu", "tbody tr", function (e) {
          e.preventDefault();

          let isActive = $(this).hasClass("active");

          $table.find("tbody tr").removeClass("active");

          if (e.type === "click") {
            $(this).toggleClass("active", !isActive);
          } else if (e.type === "contextmenu") {
            $(this).addClass("active");
            rightClick(e, false);
          }
        });

        $("#context-menu-ul")
          .find("li")
          .on("click", function (e) {
            try {
              let id = $($table).find("tr.active").attr("id");
              let screen = $("#contextMenu").attr("screen");
              if (!screen) {
                throw new Error("Screen not found");
              }
              let action = $(this).attr("action");
              if (!action) {
                throw new Error("Action not found");
              }

              let url = contextAction(screen, action, id);

              if (!url) {
                throw new Error(
                  "URL not found. \nCheck the contextAction function."
                );
              } else {
                window.location.replace(url);
              }
            } catch (err) {
              console.error(err);
            }
          });

        $(document).on("click", hideMenu);
      }
    });
  };
})(jQuery);

(function ($) {
  $.fn.validateForm = function () {
    var required_flag = false;

    this.each(function () {
      var $form = $(this);

      $form.find("input").each(function () {
        if (
          ($(this).attr("type") === "text" && $(this).val() === "") ||
          ($(this).attr("type") === "number" &&
            ($(this).val() === "0" || $(this).val() === ""))
        ) {
          if ($(this).attr("id") === "price") {
            $(this).closest("div").addClass("input-tiene-error");
            required_flag = true;
          } else {
            $(this).addClass("input-tiene-error");
            required_flag = true;
          }
        } else {
          $(this).removeClass("input-tiene-error");

          if ($(this).attr("id") === "price") {
            $(this).closest("div").removeClass("input-tiene-error");
          } else {
            $(this).removeClass("input-tiene-error");
          }
        }
      });
    });

    return required_flag;
  };
})(jQuery);

(function ($) {
  $.fn.noSpace = function (options) {
    // Definir los valores predeterminados
    var settings = $.extend(
      {
        replaceWith: "-",
      },
      options
    );

    return this.each(function () {
      $(this).on("input", function () {
        $(this).val(function (index, value) {
          return value.replace(/\s+/g, settings.replaceWith);
        });
      });
    });
  };
})(jQuery);
