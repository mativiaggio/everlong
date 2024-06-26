import { contextAction } from "./functions.js";

(function ($) {
  $.fn.contextMenuPlugin = function (options) {
    var settings = $.extend(
      {
        menuSelector: "#contextMenu",
        allowDoubleClick: false,
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

        if (settings.allowDoubleClick) {
          $table.on("dblclick", "tbody tr", function (e) {
            e.preventDefault();
            let id = $(this).attr("id");
            let screen = $menu.attr("screen");
            if (!screen) {
              console.error("Screen not found");
              return;
            }
            let action = "edit"; // Assuming "edit" action is the default for double-click
            let url = contextAction(screen, action, id);

            if (!url) {
              console.error(
                "URL not found. \nCheck the contextAction function."
              );
            } else {
              window.location.replace(url);
            }
          });
        }

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

      $form.find("input[required]").each(function () {
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

(function ($) {
  $.fn.dropdown = function (options) {
    var settings = $.extend(
      {
        title: "Selecciona una opción",
        items: [],
        defaultSearch: "title",
      },
      options
    );

    function generalConfig(dropdown, defaultSearch) {
      dropdown.addClass(
        "text-white bg-[var(--main-bg-dark)] dark:bg-[var(--main-bg-light)] text-[var(--main-text-dark)] dark:text-[var(--main-text-light)] focus:ring-4 focus:outline-none focus:ring-[var(--main-dark-10)] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center   dark:focus:ring-[var(--main-light-10)] mr-2 !min-w-40 justify-between"
      );
      dropdown.attr("type", "button").attr("findBy", defaultSearch);
      dropdown.append(`<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
    </svg>`);
    }

    function dropdownItems(dropdown, items) {
      dropdown.append(`<div id="dropdown"
    class="absolute inset-y-0 left-0 m-0 transform translate-x-[327px] translate-y-[70px] z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 h-fit dark:bg-[var(--main-bg-dark)]">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      ${items
        .map(function (item) {
          return `<li>
        <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[var(--main-dark-5)] dark:hover:text-white" id="${item.id}">${item.title}</span>
      </li>`;
        })
        .join("")}
    </div>`);
    }

    return this.each(function () {
      var $dropdownButton = $(this);

      const spanTitle = `<span id="searchButtonTitle">${settings.title}</span>`;
      $dropdownButton.text("").append(spanTitle);
      generalConfig($dropdownButton, settings.defaultSearch);
      dropdownItems($dropdownButton, settings.items);

      $dropdownButton.on("click", function (event) {
        event.stopPropagation();
        $("#dropdown").toggleClass("hidden block");
      });

      $(document).on("click", function (event) {
        if (!$(event.target).closest($dropdownButton).length) {
          $("#dropdown").removeClass("block").addClass("hidden");
        }
      });

      $("#dropdown")
        .find("span")
        .on("click", function (event) {
          $dropdownButton.attr("findBy", $(this).attr("id"));
          $dropdownButton.find("span#searchButtonTitle").text($(this).text());
        });
    });
  };
})(jQuery);
