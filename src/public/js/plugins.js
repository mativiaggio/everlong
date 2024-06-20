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

      $(document).on("click", hideMenu);
    });
  };
})(jQuery);
