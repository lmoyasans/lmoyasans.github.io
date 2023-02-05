(() => {
  // <stdin>
  (function($) {
    $.fn.navList = function() {
      var $this = $(this);
      $a = $this.find("a"), b = [];
      $a.each(function() {
        var $this2 = $(this), indent = Math.max(0, $this2.parents("li").length - 1), href = $this2.attr("href"), target = $this2.attr("target");
        b.push(
          '<a class="link depth-' + indent + '"' + (typeof target !== "undefined" && target != "" ? ' target="' + target + '"' : "") + (typeof href !== "undefined" && href != "" ? ' href="' + href + '"' : "") + '><span class="indent-' + indent + '"></span>' + $this2.text() + "</a>"
        );
      });
      return b.join("");
    };
    $.fn.panel = function(userConfig) {
      if (this.length == 0)
        return $this;
      if (this.length > 1) {
        for (var i = 0; i < this.length; i++)
          $(this[i]).panel(userConfig);
        return $this;
      }
      var $this = $(this), $body = $("body"), $window = $(window), id = $this.attr("id"), config;
      config = $.extend({
        // Delay.
        delay: 0,
        // Hide panel on link click.
        hideOnClick: false,
        // Hide panel on escape keypress.
        hideOnEscape: false,
        // Hide panel on swipe.
        hideOnSwipe: false,
        // Reset scroll position on hide.
        resetScroll: false,
        // Reset forms on hide.
        resetForms: false,
        // Side of viewport the panel will appear.
        side: null,
        // Target element for "class".
        target: $this,
        // Class to toggle.
        visibleClass: "visible"
      }, userConfig);
      if (typeof config.target != "jQuery")
        config.target = $(config.target);
      $this._hide = function(event) {
        if (!config.target.hasClass(config.visibleClass))
          return;
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        config.target.removeClass(config.visibleClass);
        window.setTimeout(function() {
          if (config.resetScroll)
            $this.scrollTop(0);
          if (config.resetForms)
            $this.find("form").each(function() {
              this.reset();
            });
        }, config.delay);
      };
      $this.css("-ms-overflow-style", "-ms-autohiding-scrollbar").css("-webkit-overflow-scrolling", "touch");
      if (config.hideOnClick) {
        $this.find("a").css("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
        $this.on("click", "a", function(event) {
          var $a2 = $(this), href = $a2.attr("href"), target = $a2.attr("target");
          if (!href || href == "#" || href == "" || href == "#" + id)
            return;
          event.preventDefault();
          event.stopPropagation();
          $this._hide();
          window.setTimeout(function() {
            if (target == "_blank")
              window.open(href);
            else
              window.location.href = href;
          }, config.delay + 10);
        });
      }
      $this.on("touchstart", function(event) {
        $this.touchPosX = event.originalEvent.touches[0].pageX;
        $this.touchPosY = event.originalEvent.touches[0].pageY;
      });
      $this.on("touchmove", function(event) {
        if ($this.touchPosX === null || $this.touchPosY === null)
          return;
        var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX, diffY = $this.touchPosY - event.originalEvent.touches[0].pageY, th = $this.outerHeight(), ts = $this.get(0).scrollHeight - $this.scrollTop();
        if (config.hideOnSwipe) {
          var result = false, boundary = 20, delta = 50;
          switch (config.side) {
            case "left":
              result = diffY < boundary && diffY > -1 * boundary && diffX > delta;
              break;
            case "right":
              result = diffY < boundary && diffY > -1 * boundary && diffX < -1 * delta;
              break;
            case "top":
              result = diffX < boundary && diffX > -1 * boundary && diffY > delta;
              break;
            case "bottom":
              result = diffX < boundary && diffX > -1 * boundary && diffY < -1 * delta;
              break;
            default:
              break;
          }
          if (result) {
            $this.touchPosX = null;
            $this.touchPosY = null;
            $this._hide();
            return false;
          }
        }
        if ($this.scrollTop() < 0 && diffY < 0 || ts > th - 2 && ts < th + 2 && diffY > 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
      $this.on("click touchend touchstart touchmove", function(event) {
        event.stopPropagation();
      });
      $this.on("click", 'a[href="#' + id + '"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
        config.target.removeClass(config.visibleClass);
      });
      $body.on("click touchend", function(event) {
        $this._hide(event);
      });
      $body.on("click", 'a[href="#' + id + '"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
        config.target.toggleClass(config.visibleClass);
      });
      if (config.hideOnEscape)
        $window.on("keydown", function(event) {
          if (event.keyCode == 27)
            $this._hide(event);
        });
      return $this;
    };
    $.fn.placeholder = function() {
      if (typeof document.createElement("input").placeholder != "undefined")
        return $(this);
      if (this.length == 0)
        return $this;
      if (this.length > 1) {
        for (var i = 0; i < this.length; i++)
          $(this[i]).placeholder();
        return $this;
      }
      var $this = $(this);
      $this.find("input[type=text],textarea").each(function() {
        var i2 = $(this);
        if (i2.val() == "" || i2.val() == i2.attr("placeholder"))
          i2.addClass("polyfill-placeholder").val(i2.attr("placeholder"));
      }).on("blur", function() {
        var i2 = $(this);
        if (i2.attr("name").match(/-polyfill-field$/))
          return;
        if (i2.val() == "")
          i2.addClass("polyfill-placeholder").val(i2.attr("placeholder"));
      }).on("focus", function() {
        var i2 = $(this);
        if (i2.attr("name").match(/-polyfill-field$/))
          return;
        if (i2.val() == i2.attr("placeholder"))
          i2.removeClass("polyfill-placeholder").val("");
      });
      $this.find("input[type=password]").each(function() {
        var i2 = $(this);
        var x = $(
          $("<div>").append(i2.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, "type=text")
        );
        if (i2.attr("id") != "")
          x.attr("id", i2.attr("id") + "-polyfill-field");
        if (i2.attr("name") != "")
          x.attr("name", i2.attr("name") + "-polyfill-field");
        x.addClass("polyfill-placeholder").val(x.attr("placeholder")).insertAfter(i2);
        if (i2.val() == "")
          i2.hide();
        else
          x.hide();
        i2.on("blur", function(event) {
          event.preventDefault();
          var x2 = i2.parent().find("input[name=" + i2.attr("name") + "-polyfill-field]");
          if (i2.val() == "") {
            i2.hide();
            x2.show();
          }
        });
        x.on("focus", function(event) {
          event.preventDefault();
          var i3 = x.parent().find("input[name=" + x.attr("name").replace("-polyfill-field", "") + "]");
          x.hide();
          i3.show().focus();
        }).on("keypress", function(event) {
          event.preventDefault();
          x.val("");
        });
      });
      $this.on("submit", function() {
        $this.find("input[type=text],input[type=password],textarea").each(function(event) {
          var i2 = $(this);
          if (i2.attr("name").match(/-polyfill-field$/))
            i2.attr("name", "");
          if (i2.val() == i2.attr("placeholder")) {
            i2.removeClass("polyfill-placeholder");
            i2.val("");
          }
        });
      }).on("reset", function(event) {
        event.preventDefault();
        $this.find("select").val($("option:first").val());
        $this.find("input,textarea").each(function() {
          var i2 = $(this), x;
          i2.removeClass("polyfill-placeholder");
          switch (this.type) {
            case "submit":
            case "reset":
              break;
            case "password":
              i2.val(i2.attr("defaultValue"));
              x = i2.parent().find("input[name=" + i2.attr("name") + "-polyfill-field]");
              if (i2.val() == "") {
                i2.hide();
                x.show();
              } else {
                i2.show();
                x.hide();
              }
              break;
            case "checkbox":
            case "radio":
              i2.attr("checked", i2.attr("defaultValue"));
              break;
            case "text":
            case "textarea":
              i2.val(i2.attr("defaultValue"));
              if (i2.val() == "") {
                i2.addClass("polyfill-placeholder");
                i2.val(i2.attr("placeholder"));
              }
              break;
            default:
              i2.val(i2.attr("defaultValue"));
              break;
          }
        });
      });
      return $this;
    };
    $.prioritize = function($elements, condition) {
      var key = "__prioritize";
      if (typeof $elements != "jQuery")
        $elements = $($elements);
      $elements.each(function() {
        var $e = $(this), $p, $parent = $e.parent();
        if ($parent.length == 0)
          return;
        if (!$e.data(key)) {
          if (!condition)
            return;
          $p = $e.prev();
          if ($p.length == 0)
            return;
          $e.prependTo($parent);
          $e.data(key, $p);
        } else {
          if (condition)
            return;
          $p = $e.data(key);
          $e.insertAfter($p);
          $e.removeData(key);
        }
      });
    };
  })(jQuery);
})();
