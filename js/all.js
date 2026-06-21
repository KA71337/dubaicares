// ==================================================
// fancyBox v3.3.5
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2018 fancyApps
//
// ==================================================
(function(window, document, $, undefined) {
  "use strict";

  window.console = window.console || {
    info: function(stuff) {}
  };

  // If there's no jQuery, fancyBox can't work
  // =========================================

  if (!$) {
    return;
  }

  // Check if fancyBox is already initialized
  // ========================================

  if ($.fn.fancybox) {
    console.info("fancyBox already initialized");

    return;
  }

  // Private default settings
  // ========================

  var defaults = {
    // Enable infinite gallery navigation
    loop: false,

    // Horizontal space between slides
    gutter: 50,

    // Enable keyboard navigation
    keyboard: true,

    // Should display navigation arrows at the screen edges
    arrows: true,

    // Should display counter at the top left corner
    infobar: true,

    // Should display close button (using `btnTpl.smallBtn` template) over the content
    // Can be true, false, "auto"
    // If "auto" - will be automatically enabled for "html", "inline" or "ajax" items
    smallBtn: "auto",

    // Should display toolbar (buttons at the top)
    // Can be true, false, "auto"
    // If "auto" - will be automatically hidden if "smallBtn" is enabled
    toolbar: "auto",

    // What buttons should appear in the top right corner.
    // Buttons will be created using templates from `btnTpl` option
    // and they will be placed into toolbar (class="fancybox-toolbar"` element)
    buttons: [
      "zoom",
      //"share",
      //"slideShow",
      //"fullScreen",
      //"download",
      "thumbs",
      "close"
    ],

    // Detect "idle" time in seconds
    idleTime: 3,

    // Disable right-click and use simple image protection for images
    protect: false,

    // Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
    modal: false,

    image: {
      // Wait for images to load before displaying
      //   true  - wait for image to load and then display;
      //   false - display thumbnail and load the full-sized image over top,
      //           requires predefined image dimensions (`data-width` and `data-height` attributes)
      preload: false
    },

    ajax: {
      // Object containing settings for ajax request
      settings: {
        // This helps to indicate that request comes from the modal
        // Feel free to change naming
        data: {
          fancybox: true
        }
      }
    },

    iframe: {
      // Iframe template
      tpl:
        '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',

      // Preload iframe before displaying it
      // This allows to calculate iframe content width and height
      // (note: Due to "Same Origin Policy", you can't get cross domain data).
      preload: true,

      // Custom CSS styling for iframe wrapping element
      // You can use this to set custom iframe dimensions
      css: {},

      // Iframe tag attributes
      attr: {
        scrolling: "auto"
      }
    },

    // Default content type if cannot be detected automatically
    defaultType: "image",

    // Open/close animation type
    // Possible values:
    //   false            - disable
    //   "zoom"           - zoom images from/to thumbnail
    //   "fade"
    //   "zoom-in-out"
    //
    animationEffect: "zoom",

    // Duration in ms for open/close animation
    animationDuration: 366,

    // Should image change opacity while zooming
    // If opacity is "auto", then opacity will be changed if image and thumbnail have different aspect ratios
    zoomOpacity: "auto",

    // Transition effect between slides
    //
    // Possible values:
    //   false            - disable
    //   "fade'
    //   "slide'
    //   "circular'
    //   "tube'
    //   "zoom-in-out'
    //   "rotate'
    //
    transitionEffect: "fade",

    // Duration in ms for transition animation
    transitionDuration: 366,

    // Custom CSS class for slide element
    slideClass: "",

    // Custom CSS class for layout
    baseClass: "",

    // Base template for layout
    baseTpl:
      '<div class="fancybox-container" role="dialog" tabindex="-1">' +
      '<div class="fancybox-bg"></div>' +
      '<div class="fancybox-inner">' +
      '<div class="fancybox-infobar">' +
      "<span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span>" +
      "</div>" +
      '<div class="fancybox-toolbar">{{buttons}}</div>' +
      '<div class="fancybox-navigation">{{arrows}}</div>' +
      '<div class="fancybox-stage"></div>' +
      '<div class="fancybox-caption"></div>' +
      "</div>" +
      "</div>",

    // Loading indicator template
    spinnerTpl: '<div class="fancybox-loading"></div>',

    // Error message template
    errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',

    btnTpl: {
      download:
        '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M13,16 L20,23 L27,16 M20,7 L20,23 M10,24 L10,28 L30,28 L30,24" />' +
        "</svg>" +
        "</a>",

      zoom:
        '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M18,17 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M24,22 L31,29" />' +
        "</svg>" +
        "</button>",

      close:
        '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M10,10 L30,30 M30,10 L10,30" />' +
        "</svg>" +
        "</button>",

      // This small close button will be appended to your html/inline/ajax content by default,
      // if "smallBtn" option is not set to false
      smallBtn:
        '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"><svg viewBox="0 0 32 32"><path d="M10,10 L22,22 M22,10 L10,22"></path></svg></button>',

      // Arrows
      arrowLeft:
        '<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M18,12 L10,20 L18,28 M10,20 L30,20"></path>' +
        "</svg>" +
        "</a>",

      arrowRight:
        '<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M10,20 L30,20 M22,12 L30,20 L22,28"></path>' +
        "</svg>" +
        "</a>"
    },

    // Container is injected into this element
    parentEl: "body",

    // Focus handling
    // ==============

    // Try to focus on the first focusable element after opening
    autoFocus: false,

    // Put focus back to active element after closing
    backFocus: true,

    // Do not let user to focus on element outside modal content
    trapFocus: true,

    // Module specific options
    // =======================

    fullScreen: {
      autoStart: false
    },

    // Set `touch: false` to disable dragging/swiping
    touch: {
      vertical: true, // Allow to drag content vertically
      momentum: true // Continue movement after releasing mouse/touch when panning
    },

    // Hash value when initializing manually,
    // set `false` to disable hash change
    hash: null,

    // Customize or add new media types
    // Example:
    /*
        media : {
            youtube : {
                params : {
                    autoplay : 0
                }
            }
        }
        */
    media: {},

    slideShow: {
      autoStart: false,
      speed: 4000
    },

    thumbs: {
      autoStart: false, // Display thumbnails on opening
      hideOnClose: true, // Hide thumbnail grid when closing animation starts
      parentEl: ".fancybox-container", // Container is injected into this element
      axis: "y" // Vertical (y) or horizontal (x) scrolling
    },

    // Use mousewheel to navigate gallery
    // If 'auto' - enabled for images only
    wheel: "auto",

    // Callbacks
    //==========

    // See Documentation/API/Events for more information
    // Example:
    /*
		afterShow: function( instance, current ) {
			console.info( 'Clicked element:' );
			console.info( current.opts.$orig );
		}
	*/

    onInit: $.noop, // When instance has been initialized

    beforeLoad: $.noop, // Before the content of a slide is being loaded
    afterLoad: $.noop, // When the content of a slide is done loading

    beforeShow: $.noop, // Before open animation starts
    afterShow: $.noop, // When content is done loading and animating

    beforeClose: $.noop, // Before the instance attempts to close. Return false to cancel the close.
    afterClose: $.noop, // After instance has been closed

    onActivate: $.noop, // When instance is brought to front
    onDeactivate: $.noop, // When other instance has been activated

    // Interaction
    // ===========

    // Use options below to customize taken action when user clicks or double clicks on the fancyBox area,
    // each option can be string or method that returns value.
    //
    // Possible values:
    //   "close"           - close instance
    //   "next"            - move to next gallery item
    //   "nextOrClose"     - move to next gallery item or close if gallery has only one item
    //   "toggleControls"  - show/hide controls
    //   "zoom"            - zoom image (if loaded)
    //   false             - do nothing

    // Clicked on the content
    clickContent: function(current, event) {
      return current.type === "image" ? "zoom" : false;
    },

    // Clicked on the slide
    clickSlide: "close",

    // Clicked on the background (backdrop) element;
    // if you have not changed the layout, then most likely you need to use `clickSlide` option
    clickOutside: "close",

    // Same as previous two, but for double click
    dblclickContent: false,
    dblclickSlide: false,
    dblclickOutside: false,

    // Custom options when mobile device is detected
    // =============================================

    mobile: {
      idleTime: false,
      clickContent: function(current, event) {
        return current.type === "image" ? "toggleControls" : false;
      },
      clickSlide: function(current, event) {
        return current.type === "image" ? "toggleControls" : "close";
      },
      dblclickContent: function(current, event) {
        return current.type === "image" ? "zoom" : false;
      },
      dblclickSlide: function(current, event) {
        return current.type === "image" ? "zoom" : false;
      }
    },

    // Internationalization
    // ====================

    lang: "en",
    i18n: {
      en: {
        CLOSE: "Close",
        NEXT: "Next",
        PREV: "Previous",
        ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
        PLAY_START: "Start slideshow",
        PLAY_STOP: "Pause slideshow",
        FULL_SCREEN: "Full screen",
        THUMBS: "Thumbnails",
        DOWNLOAD: "Download",
        SHARE: "Share",
        ZOOM: "Zoom"
      },
      de: {
        CLOSE: "Schliessen",
        NEXT: "Weiter",
        PREV: "Zurück",
        ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",
        PLAY_START: "Diaschau starten",
        PLAY_STOP: "Diaschau beenden",
        FULL_SCREEN: "Vollbild",
        THUMBS: "Vorschaubilder",
        DOWNLOAD: "Herunterladen",
        SHARE: "Teilen",
        ZOOM: "Maßstab"
      }
    }
  };

  // Few useful variables and methods
  // ================================

  var $W = $(window);
  var $D = $(document);

  var called = 0;

  // Check if an object is a jQuery object and not a native JavaScript object
  // ========================================================================
  var isQuery = function(obj) {
    return obj && obj.hasOwnProperty && obj instanceof $;
  };

  // Handle multiple browsers for "requestAnimationFrame" and "cancelAnimationFrame"
  // ===============================================================================
  var requestAFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      // if all else fails, use setTimeout
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  // Detect the supported transition-end event property name
  // =======================================================
  var transitionEnd = (function() {
    var el = document.createElement("fakeelement"),
      t;

    var transitions = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }

    return "transitionend";
  })();

  // Force redraw on an element.
  // This helps in cases where the browser doesn't redraw an updated element properly
  // ================================================================================
  var forceRedraw = function($el) {
    return $el && $el.length && $el[0].offsetHeight;
  };

  // Exclude array (`buttons`) options from deep merging
  // ===================================================
  var mergeOpts = function(opts1, opts2) {
    var rez = $.extend(true, {}, opts1, opts2);

    $.each(opts2, function(key, value) {
      if ($.isArray(value)) {
        rez[key] = value;
      }
    });

    return rez;
  };

  // Class definition
  // ================

  var FancyBox = function(content, opts, index) {
    var self = this;

    self.opts = mergeOpts({index: index}, $.fancybox.defaults);

    if ($.isPlainObject(opts)) {
      self.opts = mergeOpts(self.opts, opts);
    }

    if ($.fancybox.isMobile) {
      self.opts = mergeOpts(self.opts, self.opts.mobile);
    }

    self.id = self.opts.id || ++called;

    self.currIndex = parseInt(self.opts.index, 10) || 0;
    self.prevIndex = null;

    self.prevPos = null;
    self.currPos = 0;

    self.firstRun = true;

    // All group items
    self.group = [];

    // Existing slides (for current, next and previous gallery items)
    self.slides = {};

    // Create group elements
    self.addContent(content);

    if (!self.group.length) {
      return;
    }

    // Save last active element
    self.$lastFocus = $(document.activeElement).trigger("blur");

    self.init();
  };

  $.extend(FancyBox.prototype, {
    // Create DOM structure
    // ====================

    init: function() {
      var self = this,
        firstItem = self.group[self.currIndex],
        firstItemOpts = firstItem.opts,
        scrollbarWidth = $.fancybox.scrollbarWidth,
        $scrollDiv,
        $container,
        buttonStr;

      // Hide scrollbars
      // ===============

      if (!$.fancybox.getInstance() && firstItemOpts.hideScrollbar !== false) {
        $("body").addClass("fancybox-active");

        if (!$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {
          if (scrollbarWidth === undefined) {
            $scrollDiv = $('<div style="width:100px;height:100px;overflow:scroll;" />').appendTo("body");

            scrollbarWidth = $.fancybox.scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;

            $scrollDiv.remove();
          }

          $("head").append(
            '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: ' +
              scrollbarWidth +
              "px; }</style>"
          );

          $("body").addClass("compensate-for-scrollbar");
        }
      }

      // Build html markup and set references
      // ====================================

      // Build html code for buttons and insert into main template
      buttonStr = "";

      $.each(firstItemOpts.buttons, function(index, value) {
        buttonStr += firstItemOpts.btnTpl[value] || "";
      });

      // Create markup from base template, it will be initially hidden to
      // avoid unnecessary work like painting while initializing is not complete
      $container = $(
        self.translate(
          self,
          firstItemOpts.baseTpl
            .replace("{{buttons}}", buttonStr)
            .replace("{{arrows}}", firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight)
        )
      )
        .attr("id", "fancybox-container-" + self.id)
        .addClass("fancybox-is-hidden")
        .addClass(firstItemOpts.baseClass)
        .data("FancyBox", self)
        .appendTo(firstItemOpts.parentEl);

      // Create object holding references to jQuery wrapped nodes
      self.$refs = {
        container: $container
      };

      ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function(item) {
        self.$refs[item] = $container.find(".fancybox-" + item);
      });

      self.trigger("onInit");

      // Enable events, deactive previous instances
      self.activate();

      // Build slides, load and reveal content
      self.jumpTo(self.currIndex);
    },

    // Simple i18n support - replaces object keys found in template
    // with corresponding values
    // ============================================================

    translate: function(obj, str) {
      var arr = obj.opts.i18n[obj.opts.lang];

      return str.replace(/\{\{(\w+)\}\}/g, function(match, n) {
        var value = arr[n];

        if (value === undefined) {
          return match;
        }

        return value;
      });
    },

    // Populate current group with fresh content
    // Check if each object has valid type and content
    // ===============================================

    addContent: function(content) {
      var self = this,
        items = $.makeArray(content),
        thumbs;

      $.each(items, function(i, item) {
        var obj = {},
          opts = {},
          $item,
          type,
          found,
          src,
          srcParts;

        // Step 1 - Make sure we have an object
        // ====================================

        if ($.isPlainObject(item)) {
          // We probably have manual usage here, something like
          // $.fancybox.open( [ { src : "image.jpg", type : "image" } ] )

          obj = item;
          opts = item.opts || item;
        } else if ($.type(item) === "object" && $(item).length) {
          // Here we probably have jQuery collection returned by some selector
          $item = $(item);

          // Support attributes like `data-options='{"touch" : false}'` and `data-touch='false'`
          opts = $item.data() || {};
          opts = $.extend(true, {}, opts, opts.options);

          // Here we store clicked element
          opts.$orig = $item;

          obj.src = self.opts.src || opts.src || $item.attr("href");

          // Assume that simple syntax is used, for example:
          //   `$.fancybox.open( $("#test"), {} );`
          if (!obj.type && !obj.src) {
            obj.type = "inline";
            obj.src = item;
          }
        } else {
          // Assume we have a simple html code, for example:
          //   $.fancybox.open( '<div><h1>Hi!</h1></div>' );
          obj = {
            type: "html",
            src: item + ""
          };
        }

        // Each gallery object has full collection of options
        obj.opts = $.extend(true, {}, self.opts, opts);

        // Do not merge buttons array
        if ($.isArray(opts.buttons)) {
          obj.opts.buttons = opts.buttons;
        }

        // Step 2 - Make sure we have content type, if not - try to guess
        // ==============================================================

        type = obj.type || obj.opts.type;
        src = obj.src || "";

        if (!type && src) {
          if ((found = src.match(/\.(mp4|mov|ogv)((\?|#).*)?$/i))) {
            type = "video";

            if (!obj.opts.videoFormat) {
              obj.opts.videoFormat = "video/" + (found[1] === "ogv" ? "ogg" : found[1]);
            }
          } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
            type = "image";
          } else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
            type = "iframe";
          } else if (src.charAt(0) === "#") {
            type = "inline";
          }
        }

        if (type) {
          obj.type = type;
        } else {
          self.trigger("objectNeedsType", obj);
        }

        if (!obj.contentType) {
          obj.contentType = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1 ? "html" : obj.type;
        }

        // Step 3 - Some adjustments
        // =========================

        obj.index = self.group.length;

        if (obj.opts.smallBtn == "auto") {
          obj.opts.smallBtn = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1;
        }

        if (obj.opts.toolbar === "auto") {
          obj.opts.toolbar = !obj.opts.smallBtn;
        }

        // Find thumbnail image
        if (obj.opts.$trigger && obj.index === self.opts.index) {
          obj.opts.$thumb = obj.opts.$trigger.find("img:first");
        }

        if ((!obj.opts.$thumb || !obj.opts.$thumb.length) && obj.opts.$orig) {
          obj.opts.$thumb = obj.opts.$orig.find("img:first");
        }

        // "caption" is a "special" option, it can be used to customize caption per gallery item ..
        if ($.type(obj.opts.caption) === "function") {
          obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
        }

        if ($.type(self.opts.caption) === "function") {
          obj.opts.caption = self.opts.caption.apply(item, [self, obj]);
        }

        // Make sure we have caption as a string or jQuery object
        if (!(obj.opts.caption instanceof $)) {
          obj.opts.caption = obj.opts.caption === undefined ? "" : obj.opts.caption + "";
        }

        // Check if url contains "filter" used to filter the content
        // Example: "ajax.html #something"
        if (obj.type === "ajax") {
          srcParts = src.split(/\s+/, 2);

          if (srcParts.length > 1) {
            obj.src = srcParts.shift();

            obj.opts.filter = srcParts.shift();
          }
        }

        // Hide all buttons and disable interactivity for modal items
        if (obj.opts.modal) {
          obj.opts = $.extend(true, obj.opts, {
            // Remove buttons
            infobar: 0,
            toolbar: 0,

            smallBtn: 0,

            // Disable keyboard navigation
            keyboard: 0,

            // Disable some modules
            slideShow: 0,
            fullScreen: 0,
            thumbs: 0,
            touch: 0,

            // Disable click event handlers
            clickContent: false,
            clickSlide: false,
            clickOutside: false,
            dblclickContent: false,
            dblclickSlide: false,
            dblclickOutside: false
          });
        }

        // Step 4 - Add processed object to group
        // ======================================

        self.group.push(obj);
      });

      // Update controls if gallery is already opened
      if (Object.keys(self.slides).length) {
        self.updateControls();

        // Update thumbnails, if needed
        thumbs = self.Thumbs;

        if (thumbs && thumbs.isActive) {
          thumbs.create();

          thumbs.focus();
        }
      }
    },

    // Attach an event handler functions for:
    //   - navigation buttons
    //   - browser scrolling, resizing;
    //   - focusing
    //   - keyboard
    //   - detect idle
    // ======================================

    addEvents: function() {
      var self = this;

      self.removeEvents();

      // Make navigation elements clickable
      self.$refs.container
        .on("click.fb-close", "[data-fancybox-close]", function(e) {
          e.stopPropagation();
          e.preventDefault();

          self.close(e);
        })
        .on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function(e) {
          e.stopPropagation();
          e.preventDefault();

          self.previous();
        })
        .on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function(e) {
          e.stopPropagation();
          e.preventDefault();

          self.next();
        })
        .on("click.fb", "[data-fancybox-zoom]", function(e) {
          // Click handler for zoom button
          self[self.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
        });

      // Handle page scrolling and browser resizing
      $W.on("orientationchange.fb resize.fb", function(e) {
        if (e && e.originalEvent && e.originalEvent.type === "resize") {
          requestAFrame(function() {
            self.update();
          });
        } else {
          self.$refs.stage.hide();

          setTimeout(function() {
            self.$refs.stage.show();

            self.update();
          }, $.fancybox.isMobile ? 600 : 250);
        }
      });

      // Trap keyboard focus inside of the modal, so the user does not accidentally tab outside of the modal
      // (a.k.a. "escaping the modal")
      $D.on("focusin.fb", function(e) {
        var instance = $.fancybox ? $.fancybox.getInstance() : null;

        if (
          instance.isClosing ||
          !instance.current ||
          !instance.current.opts.trapFocus ||
          $(e.target).hasClass("fancybox-container") ||
          $(e.target).is(document)
        ) {
          return;
        }

        if (instance && $(e.target).css("position") !== "fixed" && !instance.$refs.container.has(e.target).length) {
          e.stopPropagation();

          instance.focus();
        }
      });

      // Enable keyboard navigation
      $D.on("keydown.fb", function(e) {
        var current = self.current,
          keycode = e.keyCode || e.which;

        if (!current || !current.opts.keyboard) {
          return;
        }

        if (e.ctrlKey || e.altKey || e.shiftKey || $(e.target).is("input") || $(e.target).is("textarea")) {
          return;
        }

        // Backspace and Esc keys
        if (keycode === 8 || keycode === 27) {
          e.preventDefault();

          self.close(e);

          return;
        }

        // Left arrow and Up arrow
        if (keycode === 37 || keycode === 38) {
          e.preventDefault();

          self.previous();

          return;
        }

        // Righ arrow and Down arrow
        if (keycode === 39 || keycode === 40) {
          e.preventDefault();

          self.next();

          return;
        }

        self.trigger("afterKeydown", e, keycode);
      });

      // Hide controls after some inactivity period
      if (self.group[self.currIndex].opts.idleTime) {
        self.idleSecondsCounter = 0;

        $D.on(
          "mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",
          function(e) {
            self.idleSecondsCounter = 0;

            if (self.isIdle) {
              self.showControls();
            }

            self.isIdle = false;
          }
        );

        self.idleInterval = window.setInterval(function() {
          self.idleSecondsCounter++;

          if (self.idleSecondsCounter >= self.group[self.currIndex].opts.idleTime && !self.isDragging) {
            self.isIdle = true;
            self.idleSecondsCounter = 0;

            self.hideControls();
          }
        }, 1000);
      }
    },

    // Remove events added by the core
    // ===============================

    removeEvents: function() {
      var self = this;

      $W.off("orientationchange.fb resize.fb");
      $D.off("focusin.fb keydown.fb .fb-idle");

      this.$refs.container.off(".fb-close .fb-prev .fb-next");

      if (self.idleInterval) {
        window.clearInterval(self.idleInterval);

        self.idleInterval = null;
      }
    },

    // Change to previous gallery item
    // ===============================

    previous: function(duration) {
      return this.jumpTo(this.currPos - 1, duration);
    },

    // Change to next gallery item
    // ===========================

    next: function(duration) {
      return this.jumpTo(this.currPos + 1, duration);
    },

    // Switch to selected gallery item
    // ===============================

    jumpTo: function(pos, duration) {
      var self = this,
        groupLen = self.group.length,
        firstRun,
        loop,
        current,
        previous,
        canvasWidth,
        currentPos,
        transitionProps;

      if (self.isDragging || self.isClosing || (self.isAnimating && self.firstRun)) {
        return;
      }

      pos = parseInt(pos, 10);

      // Should loop?
      loop = self.current ? self.current.opts.loop : self.opts.loop;

      if (!loop && (pos < 0 || pos >= groupLen)) {
        return false;
      }

      firstRun = self.firstRun = !Object.keys(self.slides).length;

      if (groupLen < 2 && !firstRun && !!self.isDragging) {
        return;
      }

      previous = self.current;

      self.prevIndex = self.currIndex;
      self.prevPos = self.currPos;

      // Create slides
      current = self.createSlide(pos);

      if (groupLen > 1) {
        if (loop || current.index > 0) {
          self.createSlide(pos - 1);
        }

        if (loop || current.index < groupLen - 1) {
          self.createSlide(pos + 1);
        }
      }

      self.current = current;
      self.currIndex = current.index;
      self.currPos = current.pos;

      self.trigger("beforeShow", firstRun);

      self.updateControls();

      currentPos = $.fancybox.getTranslate(current.$slide);

      current.isMoved = (currentPos.left !== 0 || currentPos.top !== 0) && !current.$slide.hasClass("fancybox-animated");

      // Validate duration length
      current.forcedDuration = undefined;

      if ($.isNumeric(duration)) {
        current.forcedDuration = duration;
      } else {
        duration = current.opts[firstRun ? "animationDuration" : "transitionDuration"];
      }

      duration = parseInt(duration, 10);

      // Fresh start - reveal container, current slide and start loading content
      if (firstRun) {
        if (current.opts.animationEffect && duration) {
          self.$refs.container.css("transition-duration", duration + "ms");
        }

        self.$refs.container.removeClass("fancybox-is-hidden");

        forceRedraw(self.$refs.container);

        self.$refs.container.addClass("fancybox-is-open");

        forceRedraw(self.$refs.container);

        // Make current slide visible
        current.$slide.addClass("fancybox-slide--previous");

        // Attempt to load content into slide;
        // at this point image would start loading, but inline/html content would load immediately
        self.loadSlide(current);

        current.$slide.removeClass("fancybox-slide--previous").addClass("fancybox-slide--current");

        self.preload("image");

        return;
      }

      // Clean up
      $.each(self.slides, function(index, slide) {
        $.fancybox.stop(slide.$slide);
      });

      // Make current that slide is visible even if content is still loading
      current.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current");

      // If slides have been dragged, animate them to correct position
      if (current.isMoved) {
        canvasWidth = Math.round(current.$slide.width());

        $.each(self.slides, function(index, slide) {
          var pos = slide.pos - current.pos;

          $.fancybox.animate(
            slide.$slide,
            {
              top: 0,
              left: pos * canvasWidth + pos * slide.opts.gutter
            },
            duration,
            function() {
              slide.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous");

              if (slide.pos === self.currPos) {
                current.isMoved = false;

                self.complete();
              }
            }
          );
        });
      } else {
        self.$refs.stage.children().removeAttr("style");
      }

      // Start transition that reveals current content
      // or wait when it will be loaded

      if (current.isLoaded) {
        self.revealContent(current);
      } else {
        self.loadSlide(current);
      }

      self.preload("image");

      if (previous.pos === current.pos) {
        return;
      }

      // Handle previous slide
      // =====================

      transitionProps = "fancybox-slide--" + (previous.pos > current.pos ? "next" : "previous");

      previous.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous");

      previous.isComplete = false;

      if (!duration || (!current.isMoved && !current.opts.transitionEffect)) {
        return;
      }

      if (current.isMoved) {
        previous.$slide.addClass(transitionProps);
      } else {
        transitionProps = "fancybox-animated " + transitionProps + " fancybox-fx-" + current.opts.transitionEffect;

        $.fancybox.animate(previous.$slide, transitionProps, duration, function() {
          previous.$slide.removeClass(transitionProps).removeAttr("style");
        });
      }
    },

    // Create new "slide" element
    // These are gallery items  that are actually added to DOM
    // =======================================================

    createSlide: function(pos) {
      var self = this,
        $slide,
        index;

      index = pos % self.group.length;
      index = index < 0 ? self.group.length + index : index;

      if (!self.slides[pos] && self.group[index]) {
        $slide = $('<div class="fancybox-slide"></div>').appendTo(self.$refs.stage);

        self.slides[pos] = $.extend(true, {}, self.group[index], {
          pos: pos,
          $slide: $slide,
          isLoaded: false
        });

        self.updateSlide(self.slides[pos]);
      }

      return self.slides[pos];
    },

    // Scale image to the actual size of the image;
    // x and y values should be relative to the slide
    // ==============================================

    scaleToActual: function(x, y, duration) {
      var self = this,
        current = self.current,
        $content = current.$content,
        canvasWidth = $.fancybox.getTranslate(current.$slide).width,
        canvasHeight = $.fancybox.getTranslate(current.$slide).height,
        newImgWidth = current.width,
        newImgHeight = current.height,
        imgPos,
        posX,
        posY,
        scaleX,
        scaleY;

      if (self.isAnimating || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
        return;
      }

      $.fancybox.stop($content);

      self.isAnimating = true;

      x = x === undefined ? canvasWidth * 0.5 : x;
      y = y === undefined ? canvasHeight * 0.5 : y;

      imgPos = $.fancybox.getTranslate($content);

      imgPos.top -= $.fancybox.getTranslate(current.$slide).top;
      imgPos.left -= $.fancybox.getTranslate(current.$slide).left;

      scaleX = newImgWidth / imgPos.width;
      scaleY = newImgHeight / imgPos.height;

      // Get center position for original image
      posX = canvasWidth * 0.5 - newImgWidth * 0.5;
      posY = canvasHeight * 0.5 - newImgHeight * 0.5;

      // Make sure image does not move away from edges
      if (newImgWidth > canvasWidth) {
        posX = imgPos.left * scaleX - (x * scaleX - x);

        if (posX > 0) {
          posX = 0;
        }

        if (posX < canvasWidth - newImgWidth) {
          posX = canvasWidth - newImgWidth;
        }
      }

      if (newImgHeight > canvasHeight) {
        posY = imgPos.top * scaleY - (y * scaleY - y);

        if (posY > 0) {
          posY = 0;
        }

        if (posY < canvasHeight - newImgHeight) {
          posY = canvasHeight - newImgHeight;
        }
      }

      self.updateCursor(newImgWidth, newImgHeight);

      $.fancybox.animate(
        $content,
        {
          top: posY,
          left: posX,
          scaleX: scaleX,
          scaleY: scaleY
        },
        duration || 330,
        function() {
          self.isAnimating = false;
        }
      );

      // Stop slideshow
      if (self.SlideShow && self.SlideShow.isActive) {
        self.SlideShow.stop();
      }
    },

    // Scale image to fit inside parent element
    // ========================================

    scaleToFit: function(duration) {
      var self = this,
        current = self.current,
        $content = current.$content,
        end;

      if (self.isAnimating || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
        return;
      }

      $.fancybox.stop($content);

      self.isAnimating = true;

      end = self.getFitPos(current);

      self.updateCursor(end.width, end.height);

      $.fancybox.animate(
        $content,
        {
          top: end.top,
          left: end.left,
          scaleX: end.width / $content.width(),
          scaleY: end.height / $content.height()
        },
        duration || 330,
        function() {
          self.isAnimating = false;
        }
      );
    },

    // Calculate image size to fit inside viewport
    // ===========================================

    getFitPos: function(slide) {
      var self = this,
        $content = slide.$content,
        width = slide.width || slide.opts.width,
        height = slide.height || slide.opts.height,
        maxWidth,
        maxHeight,
        minRatio,
        margin,
        aspectRatio,
        rez = {};

      if (!slide.isLoaded || !$content || !$content.length) {
        return false;
      }

      margin = {
        top: parseInt(slide.$slide.css("paddingTop"), 10),
        right: parseInt(slide.$slide.css("paddingRight"), 10),
        bottom: parseInt(slide.$slide.css("paddingBottom"), 10),
        left: parseInt(slide.$slide.css("paddingLeft"), 10)
      };

      // We can not use $slide width here, because it can have different diemensions while in transiton
      maxWidth = parseInt(self.$refs.stage.width(), 10) - (margin.left + margin.right);
      maxHeight = parseInt(self.$refs.stage.height(), 10) - (margin.top + margin.bottom);

      if (!width || !height) {
        width = maxWidth;
        height = maxHeight;
      }

      minRatio = Math.min(1, maxWidth / width, maxHeight / height);

      // Use floor rounding to make sure it really fits
      width = Math.floor(minRatio * width);
      height = Math.floor(minRatio * height);

      if (slide.type === "image") {
        rez.top = Math.floor((maxHeight - height) * 0.5) + margin.top;
        rez.left = Math.floor((maxWidth - width) * 0.5) + margin.left;
      } else if (slide.contentType === "video") {
        // Force aspect ratio for the video
        // "I say the whole world must learn of our peaceful ways… by force!"
        aspectRatio = slide.opts.width && slide.opts.height ? width / height : slide.opts.ratio || 16 / 9;

        if (height > width / aspectRatio) {
          height = width / aspectRatio;
        } else if (width > height * aspectRatio) {
          width = height * aspectRatio;
        }
      }

      rez.width = width;
      rez.height = height;

      return rez;
    },

    // Update content size and position for all slides
    // ==============================================

    update: function() {
      var self = this;

      $.each(self.slides, function(key, slide) {
        self.updateSlide(slide);
      });
    },

    // Update slide content position and size
    // ======================================

    updateSlide: function(slide, duration) {
      var self = this,
        $content = slide && slide.$content,
        width = slide.width || slide.opts.width,
        height = slide.height || slide.opts.height;

      if ($content && (width || height || slide.contentType === "video") && !slide.hasError) {
        $.fancybox.stop($content);

        $.fancybox.setTranslate($content, self.getFitPos(slide));

        if (slide.pos === self.currPos) {
          self.isAnimating = false;

          self.updateCursor();
        }
      }

      slide.$slide.trigger("refresh");

      self.$refs.toolbar.toggleClass("compensate-for-scrollbar", slide.$slide.get(0).scrollHeight > slide.$slide.get(0).clientHeight);

      self.trigger("onUpdate", slide);
    },

    // Horizontally center slide
    // =========================

    centerSlide: function(slide, duration) {
      var self = this,
        canvasWidth,
        pos;

      if (self.current) {
        canvasWidth = Math.round(slide.$slide.width());
        pos = slide.pos - self.current.pos;

        $.fancybox.animate(
          slide.$slide,
          {
            top: 0,
            left: pos * canvasWidth + pos * slide.opts.gutter,
            opacity: 1
          },
          duration === undefined ? 0 : duration,
          null,
          false
        );
      }
    },

    // Update cursor style depending if content can be zoomed
    // ======================================================

    updateCursor: function(nextWidth, nextHeight) {
      var self = this,
        current = self.current,
        $container = self.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut"),
        isZoomable;

      if (!current || self.isClosing) {
        return;
      }

      isZoomable = self.isZoomable();

      $container.toggleClass("fancybox-is-zoomable", isZoomable);

      $("[data-fancybox-zoom]").prop("disabled", !isZoomable);

      // Set cursor to zoom in/out if click event is 'zoom'
      if (
        isZoomable &&
        (current.opts.clickContent === "zoom" || ($.isFunction(current.opts.clickContent) && current.opts.clickContent(current) === "zoom"))
      ) {
        if (self.isScaledDown(nextWidth, nextHeight)) {
          // If image is scaled down, then, obviously, it can be zoomed to full size
          $container.addClass("fancybox-can-zoomIn");
        } else {
          if (current.opts.touch) {
            // If image size ir largen than available available and touch module is not disable,
            // then user can do panning
            $container.addClass("fancybox-can-drag");
          } else {
            $container.addClass("fancybox-can-zoomOut");
          }
        }
      } else if (current.opts.touch && current.contentType !== "video") {
        $container.addClass("fancybox-can-drag");
      }
    },

    // Check if current slide is zoomable
    // ==================================

    isZoomable: function() {
      var self = this,
        current = self.current,
        fitPos;

      // Assume that slide is zoomable if:
      //   - image is still loading
      //   - actual size of the image is smaller than available area
      if (current && !self.isClosing && current.type === "image" && !current.hasError) {
        if (!current.isLoaded) {
          return true;
        }

        fitPos = self.getFitPos(current);

        if (current.width > fitPos.width || current.height > fitPos.height) {
          return true;
        }
      }

      return false;
    },

    // Check if current image dimensions are smaller than actual
    // =========================================================

    isScaledDown: function(nextWidth, nextHeight) {
      var self = this,
        rez = false,
        current = self.current,
        $content = current.$content;

      if (nextWidth !== undefined && nextHeight !== undefined) {
        rez = nextWidth < current.width && nextHeight < current.height;
      } else if ($content) {
        rez = $.fancybox.getTranslate($content);
        rez = rez.width < current.width && rez.height < current.height;
      }

      return rez;
    },

    // Check if image dimensions exceed parent element
    // ===============================================

    canPan: function() {
      var self = this,
        rez = false,
        current = self.current,
        $content;

      if (current.type === "image" && ($content = current.$content) && !current.hasError) {
        rez = self.getFitPos(current);
        rez = Math.abs($content.width() - rez.width) > 1 || Math.abs($content.height() - rez.height) > 1;
      }

      return rez;
    },

    // Load content into the slide
    // ===========================

    loadSlide: function(slide) {
      var self = this,
        type,
        $slide,
        ajaxLoad;

      if (slide.isLoading || slide.isLoaded) {
        return;
      }

      slide.isLoading = true;

      self.trigger("beforeLoad", slide);

      type = slide.type;
      $slide = slide.$slide;

      $slide
        .off("refresh")
        .trigger("onReset")
        .addClass(slide.opts.slideClass);

      // Create content depending on the type
      switch (type) {
        case "image":
          self.setImage(slide);

          break;

        case "iframe":
          self.setIframe(slide);

          break;

        case "html":
          self.setContent(slide, slide.src || slide.content);

          break;

        case "video":
          self.setContent(
            slide,
            '<video class="fancybox-video" controls controlsList="nodownload">' +
              '<source src="' +
              slide.src +
              '" type="' +
              slide.opts.videoFormat +
              '">' +
              "Your browser doesn't support HTML5 video" +
              "</video"
          );

          break;

        case "inline":
          if ($(slide.src).length) {
            self.setContent(slide, $(slide.src));
          } else {
            self.setError(slide);
          }

          break;

        case "ajax":
          self.showLoading(slide);

          ajaxLoad = $.ajax(
            $.extend({}, slide.opts.ajax.settings, {
              url: slide.src,
              success: function(data, textStatus) {
                if (textStatus === "success") {
                  self.setContent(slide, data);
                }
              },
              error: function(jqXHR, textStatus) {
                if (jqXHR && textStatus !== "abort") {
                  self.setError(slide);
                }
              }
            })
          );

          $slide.one("onReset", function() {
            ajaxLoad.abort();
          });

          break;

        default:
          self.setError(slide);

          break;
      }

      return true;
    },

    // Use thumbnail image, if possible
    // ================================

    setImage: function(slide) {
      var self = this,
        srcset = slide.opts.srcset || slide.opts.image.srcset,
        thumbSrc,
        found,
        temp,
        pxRatio,
        windowWidth;

      // Check if need to show loading icon
      slide.timouts = setTimeout(function() {
        var $img = slide.$image;

        if (slide.isLoading && (!$img || !$img[0].complete) && !slide.hasError) {
          self.showLoading(slide);
        }
      }, 350);

      // If we have "srcset", then we need to find first matching "src" value.
      // This is necessary, because when you set an src attribute, the browser will preload the image
      // before any javascript or even CSS is applied.
      if (srcset) {
        pxRatio = window.devicePixelRatio || 1;
        windowWidth = window.innerWidth * pxRatio;

        temp = srcset.split(",").map(function(el) {
          var ret = {};

          el
            .trim()
            .split(/\s+/)
            .forEach(function(el, i) {
              var value = parseInt(el.substring(0, el.length - 1), 10);

              if (i === 0) {
                return (ret.url = el);
              }

              if (value) {
                ret.value = value;
                ret.postfix = el[el.length - 1];
              }
            });

          return ret;
        });

        // Sort by value
        temp.sort(function(a, b) {
          return a.value - b.value;
        });

        // Ok, now we have an array of all srcset values
        for (var j = 0; j < temp.length; j++) {
          var el = temp[j];

          if ((el.postfix === "w" && el.value >= windowWidth) || (el.postfix === "x" && el.value >= pxRatio)) {
            found = el;
            break;
          }
        }

        // If not found, take the last one
        if (!found && temp.length) {
          found = temp[temp.length - 1];
        }

        if (found) {
          slide.src = found.url;

          // If we have default width/height values, we can calculate height for matching source
          if (slide.width && slide.height && found.postfix == "w") {
            slide.height = slide.width / slide.height * found.value;
            slide.width = found.value;
          }

          slide.opts.srcset = srcset;
        }
      }

      // This will be wrapper containing both ghost and actual image
      slide.$content = $('<div class="fancybox-content"></div>')
        .addClass("fancybox-is-hidden")
        .appendTo(slide.$slide.addClass("fancybox-slide--image"));

      // If we have a thumbnail, we can display it while actual image is loading
      // Users will not stare at black screen and actual image will appear gradually
      thumbSrc = slide.opts.thumb || (slide.opts.$thumb && slide.opts.$thumb.length ? slide.opts.$thumb.attr("src") : false);

      if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && thumbSrc) {
        slide.width = slide.opts.width;
        slide.height = slide.opts.height;

        slide.$ghost = $("<img />")
          .one("error", function() {
            $(this).remove();

            slide.$ghost = null;
          })
          .one("load", function() {
            self.afterLoad(slide);
          })
          .addClass("fancybox-image")
          .appendTo(slide.$content)
          .attr("src", thumbSrc);
      }

      // Start loading actual image
      self.setBigImage(slide);
    },

    // Create full-size image
    // ======================

    setBigImage: function(slide) {
      var self = this,
        $img = $("<img />");

      slide.$image = $img
        .one("error", function() {
          self.setError(slide);
        })
        .one("load", function() {
          var sizes;

          if (!slide.$ghost) {
            self.resolveImageSlideSize(slide, this.naturalWidth, this.naturalHeight);

            self.afterLoad(slide);
          }

          // Clear timeout that checks if loading icon needs to be displayed
          if (slide.timouts) {
            clearTimeout(slide.timouts);
            slide.timouts = null;
          }

          if (self.isClosing) {
            return;
          }

          if (slide.opts.srcset) {
            sizes = slide.opts.sizes;

            if (!sizes || sizes === "auto") {
              sizes =
                (slide.width / slide.height > 1 && $W.width() / $W.height() > 1 ? "100" : Math.round(slide.width / slide.height * 100)) +
                "vw";
            }

            $img.attr("sizes", sizes).attr("srcset", slide.opts.srcset);
          }

          // Hide temporary image after some delay
          if (slide.$ghost) {
            setTimeout(function() {
              if (slide.$ghost && !self.isClosing) {
                slide.$ghost.hide();
              }
            }, Math.min(300, Math.max(1000, slide.height / 1600)));
          }

          self.hideLoading(slide);
        })
        .addClass("fancybox-image")
        .attr("src", slide.src)
        .appendTo(slide.$content);

      if (($img[0].complete || $img[0].readyState == "complete") && $img[0].naturalWidth && $img[0].naturalHeight) {
        $img.trigger("load");
      } else if ($img[0].error) {
        $img.trigger("error");
      }
    },

    // Computes the slide size from image size and maxWidth/maxHeight
    // ==============================================================

    resolveImageSlideSize: function(slide, imgWidth, imgHeight) {
      var maxWidth = parseInt(slide.opts.width, 10),
        maxHeight = parseInt(slide.opts.height, 10);

      // Sets the default values from the image
      slide.width = imgWidth;
      slide.height = imgHeight;

      if (maxWidth > 0) {
        slide.width = maxWidth;
        slide.height = Math.floor(maxWidth * imgHeight / imgWidth);
      }

      if (maxHeight > 0) {
        slide.width = Math.floor(maxHeight * imgWidth / imgHeight);
        slide.height = maxHeight;
      }
    },

    // Create iframe wrapper, iframe and bindings
    // ==========================================

    setIframe: function(slide) {
      var self = this,
        opts = slide.opts.iframe,
        $slide = slide.$slide,
        $iframe;

      slide.$content = $('<div class="fancybox-content' + (opts.preload ? " fancybox-is-hidden" : "") + '"></div>')
        .css(opts.css)
        .appendTo($slide);

      $slide.addClass("fancybox-slide--" + slide.contentType);

      slide.$iframe = $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime()))
        .attr(opts.attr)
        .appendTo(slide.$content);

      if (opts.preload) {
        self.showLoading(slide);

        // Unfortunately, it is not always possible to determine if iframe is successfully loaded
        // (due to browser security policy)

        $iframe.on("load.fb error.fb", function(e) {
          this.isReady = 1;

          slide.$slide.trigger("refresh");

          self.afterLoad(slide);
        });

        // Recalculate iframe content size
        // ===============================

        $slide.on("refresh.fb", function() {
          var $content = slide.$content,
            frameWidth = opts.css.width,
            frameHeight = opts.css.height,
            $contents,
            $body;

          if ($iframe[0].isReady !== 1) {
            return;
          }

          try {
            $contents = $iframe.contents();
            $body = $contents.find("body");
          } catch (ignore) {}

          // Calculate contnet dimensions if it is accessible
          if ($body && $body.length && $body.children().length) {
            $content.css({
              width: "",
              height: ""
            });

            if (frameWidth === undefined) {
              frameWidth = Math.ceil(Math.max($body[0].clientWidth, $body.outerWidth(true)));
            }

            if (frameWidth) {
              $content.width(frameWidth);
            }

            if (frameHeight === undefined) {
              frameHeight = Math.ceil(Math.max($body[0].clientHeight, $body.outerHeight(true)));
            }

            if (frameHeight) {
              $content.height(frameHeight);
            }
          }

          $content.removeClass("fancybox-is-hidden");
        });
      } else {
        this.afterLoad(slide);
      }

      $iframe.attr("src", slide.src);

      // Remove iframe if closing or changing gallery item
      $slide.one("onReset", function() {
        // This helps IE not to throw errors when closing
        try {
          $(this)
            .find("iframe")
            .hide()
            .unbind()
            .attr("src", "//about:blank");
        } catch (ignore) {}

        $(this)
          .off("refresh.fb")
          .empty();

        slide.isLoaded = false;
      });
    },

    // Wrap and append content to the slide
    // ======================================

    setContent: function(slide, content) {
      var self = this;

      if (self.isClosing) {
        return;
      }

      self.hideLoading(slide);

      if (slide.$content) {
        $.fancybox.stop(slide.$content);
      }

      slide.$slide.empty();

      // If content is a jQuery object, then it will be moved to the slide.
      // The placeholder is created so we will know where to put it back.
      if (isQuery(content) && content.parent().length) {
        // Make sure content is not already moved to fancyBox
        content
          .parent()
          .parent(".fancybox-slide--inline")
          .trigger("onReset");

        // Create temporary element marking original place of the content
        slide.$placeholder = $("<div>")
          .hide()
          .insertAfter(content);

        // Make sure content is visible
        content.css("display", "inline-block");
      } else if (!slide.hasError) {
        // If content is just a plain text, try to convert it to html
        if ($.type(content) === "string") {
          content = $("<div>")
            .append($.trim(content))
            .contents();

          // If we have text node, then add wrapping element to make vertical alignment work
          if (content[0].nodeType === 3) {
            content = $("<div>").html(content);
          }
        }

        // If "filter" option is provided, then filter content
        if (slide.opts.filter) {
          content = $("<div>")
            .html(content)
            .find(slide.opts.filter);
        }
      }

      slide.$slide.one("onReset", function() {
        // Pause all html5 video/audio
        $(this)
          .find("video,audio")
          .trigger("pause");

        // Put content back
        if (slide.$placeholder) {
          slide.$placeholder.after(content.hide()).remove();

          slide.$placeholder = null;
        }

        // Remove custom close button
        if (slide.$smallBtn) {
          slide.$smallBtn.remove();

          slide.$smallBtn = null;
        }

        // Remove content and mark slide as not loaded
        if (!slide.hasError) {
          $(this).empty();

          slide.isLoaded = false;
        }
      });

      $(content).appendTo(slide.$slide);

      if ($(content).is("video,audio")) {
        $(content).addClass("fancybox-video");

        $(content).wrap("<div></div>");

        slide.contentType = "video";

        slide.opts.width = slide.opts.width || $(content).attr("width");
        slide.opts.height = slide.opts.height || $(content).attr("height");
      }

      slide.$content = slide.$slide
        .children()
        .filter("div,form,main,video,audio")
        .first()
        .addClass("fancybox-content");

      slide.$slide.addClass("fancybox-slide--" + slide.contentType);

      this.afterLoad(slide);
    },

    // Display error message
    // =====================

    setError: function(slide) {
      slide.hasError = true;

      slide.$slide
        .trigger("onReset")
        .removeClass("fancybox-slide--" + slide.contentType)
        .addClass("fancybox-slide--error");

      slide.contentType = "html";

      this.setContent(slide, this.translate(slide, slide.opts.errorTpl));

      if (slide.pos === this.currPos) {
        this.isAnimating = false;
      }
    },

    // Show loading icon inside the slide
    // ==================================

    showLoading: function(slide) {
      var self = this;

      slide = slide || self.current;

      if (slide && !slide.$spinner) {
        slide.$spinner = $(self.translate(self, self.opts.spinnerTpl)).appendTo(slide.$slide);
      }
    },

    // Remove loading icon from the slide
    // ==================================

    hideLoading: function(slide) {
      var self = this;

      slide = slide || self.current;

      if (slide && slide.$spinner) {
        slide.$spinner.remove();

        delete slide.$spinner;
      }
    },

    // Adjustments after slide content has been loaded
    // ===============================================

    afterLoad: function(slide) {
      var self = this;

      if (self.isClosing) {
        return;
      }

      slide.isLoading = false;
      slide.isLoaded = true;

      self.trigger("afterLoad", slide);

      self.hideLoading(slide);

      if (slide.pos === self.currPos) {
        self.updateCursor();
      }

      if (slide.opts.smallBtn && (!slide.$smallBtn || !slide.$smallBtn.length)) {
        slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).prependTo(slide.$content);
      }

      if (slide.opts.protect && slide.$content && !slide.hasError) {
        // Disable right click
        slide.$content.on("contextmenu.fb", function(e) {
          if (e.button == 2) {
            e.preventDefault();
          }

          return true;
        });

        // Add fake element on top of the image
        // This makes a bit harder for user to select image
        if (slide.type === "image") {
          $('<div class="fancybox-spaceball"></div>').appendTo(slide.$content);
        }
      }

      self.revealContent(slide);
    },

    // Make content visible
    // This method is called right after content has been loaded or
    // user navigates gallery and transition should start
    // ============================================================

    revealContent: function(slide) {
      var self = this,
        $slide = slide.$slide,
        end = false,
        start = false,
        effect,
        effectClassName,
        duration,
        opacity;

      effect = slide.opts[self.firstRun ? "animationEffect" : "transitionEffect"];
      duration = slide.opts[self.firstRun ? "animationDuration" : "transitionDuration"];

      duration = parseInt(slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10);

      // Do not animate if revealing the same slide
      if (slide.pos === self.currPos) {
        if (slide.isComplete) {
          effect = false;
        } else {
          self.isAnimating = true;
        }
      }

      if (slide.isMoved || slide.pos !== self.currPos || !duration) {
        effect = false;
      }

      // Check if can zoom
      if (effect === "zoom") {
        if (slide.pos === self.currPos && duration && slide.type === "image" && !slide.hasError && (start = self.getThumbPos(slide))) {
          end = self.getFitPos(slide);
        } else {
          effect = "fade";
        }
      }

      // Zoom animation
      // ==============
      if (effect === "zoom") {
        end.scaleX = end.width / start.width;
        end.scaleY = end.height / start.height;

        // Check if we need to animate opacity
        opacity = slide.opts.zoomOpacity;

        if (opacity == "auto") {
          opacity = Math.abs(slide.width / slide.height - start.width / start.height) > 0.1;
        }

        if (opacity) {
          start.opacity = 0.1;
          end.opacity = 1;
        }

        // Draw image at start position
        $.fancybox.setTranslate(slide.$content.removeClass("fancybox-is-hidden"), start);

        forceRedraw(slide.$content);

        // Start animation
        $.fancybox.animate(slide.$content, end, duration, function() {
          self.isAnimating = false;

          self.complete();
        });

        return;
      }

      self.updateSlide(slide);

      // Simply show content
      // ===================

      if (!effect) {
        forceRedraw($slide);

        slide.$content.removeClass("fancybox-is-hidden");

        if (slide.pos === self.currPos) {
          self.complete();
        }

        return;
      }

      $.fancybox.stop($slide);

      effectClassName = "fancybox-animated fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-fx-" + effect;

      $slide
        .removeAttr("style")
        .removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous")
        .addClass(effectClassName);

      slide.$content.removeClass("fancybox-is-hidden");

      // Force reflow for CSS3 transitions
      forceRedraw($slide);

      $.fancybox.animate(
        $slide,
        "fancybox-slide--current",
        duration,
        function(e) {
          $slide.removeClass(effectClassName).removeAttr("style");

          if (slide.pos === self.currPos) {
            self.complete();
          }
        },
        true
      );
    },

    // Check if we can and have to zoom from thumbnail
    //================================================

    getThumbPos: function(slide) {
      var self = this,
        rez = false,
        $thumb = slide.opts.$thumb,
        thumbPos = $thumb && $thumb.length && $thumb[0].ownerDocument === document ? $thumb.offset() : 0,
        slidePos;

      // Check if element is inside the viewport by at least 1 pixel
      var isElementVisible = function($el) {
        var element = $el[0],
          elementRect = element.getBoundingClientRect(),
          parentRects = [],
          visibleInAllParents;

        while (element.parentElement !== null) {
          if ($(element.parentElement).css("overflow") === "hidden" || $(element.parentElement).css("overflow") === "auto") {
            parentRects.push(element.parentElement.getBoundingClientRect());
          }

          element = element.parentElement;
        }

        visibleInAllParents = parentRects.every(function(parentRect) {
          var visiblePixelX = Math.min(elementRect.right, parentRect.right) - Math.max(elementRect.left, parentRect.left);
          var visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom) - Math.max(elementRect.top, parentRect.top);

          return visiblePixelX > 0 && visiblePixelY > 0;
        });

        return (
          visibleInAllParents &&
          elementRect.bottom > 0 &&
          elementRect.right > 0 &&
          elementRect.left < $(window).width() &&
          elementRect.top < $(window).height()
        );
      };

      if (thumbPos && isElementVisible($thumb)) {
        slidePos = self.$refs.stage.offset();

        rez = {
          top: thumbPos.top - slidePos.top + parseFloat($thumb.css("border-top-width") || 0),
          left: thumbPos.left - slidePos.left + parseFloat($thumb.css("border-left-width") || 0),
          width: $thumb.width(),
          height: $thumb.height(),
          scaleX: 1,
          scaleY: 1
        };
      }

      return rez;
    },

    // Final adjustments after current gallery item is moved to position
    // and it`s content is loaded
    // ==================================================================

    complete: function() {
      var self = this,
        current = self.current,
        slides = {};

      if (current.isMoved || !current.isLoaded) {
        return;
      }

      if (!current.isComplete) {
        current.isComplete = true;

        current.$slide.siblings().trigger("onReset");

        self.preload("inline");

        // Trigger any CSS3 transiton inside the slide
        forceRedraw(current.$slide);

        current.$slide.addClass("fancybox-slide--complete");

        // Remove unnecessary slides
        $.each(self.slides, function(key, slide) {
          if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
            slides[slide.pos] = slide;
          } else if (slide) {
            $.fancybox.stop(slide.$slide);

            slide.$slide.off().remove();
          }
        });

        self.slides = slides;
      }

      self.isAnimating = false;

      self.updateCursor();

      self.trigger("afterShow");

      // Play first html5 video/audio
      current.$slide
        .find("video,audio")
        .filter(":visible:first")
        .trigger("play");

      // Try to focus on the first focusable element
      if (
        $(document.activeElement).is("[disabled]") ||
        (current.opts.autoFocus && !(current.type == "image" || current.type === "iframe"))
      ) {
        self.focus();
      }
    },

    // Preload next and previous slides
    // ================================

    preload: function(type) {
      var self = this,
        next = self.slides[self.currPos + 1],
        prev = self.slides[self.currPos - 1];

      if (next && next.type === type) {
        self.loadSlide(next);
      }

      if (prev && prev.type === type) {
        self.loadSlide(prev);
      }
    },

    // Try to find and focus on the first focusable element
    // ====================================================

    focus: function() {
      var current = this.current,
        $el;

      if (this.isClosing) {
        return;
      }

      if (current && current.isComplete && current.$content) {
        // Look for first input with autofocus attribute
        $el = current.$content.find("input[autofocus]:enabled:visible:first");

        if (!$el.length) {
          $el = current.$content.find("button,:input,[tabindex],a").filter(":enabled:visible:first");
        }

        $el = $el && $el.length ? $el : current.$content;

        $el.trigger("focus");
      }
    },

    // Activates current instance - brings container to the front and enables keyboard,
    // notifies other instances about deactivating
    // =================================================================================

    activate: function() {
      var self = this;

      // Deactivate all instances
      $(".fancybox-container").each(function() {
        var instance = $(this).data("FancyBox");

        // Skip self and closing instances
        if (instance && instance.id !== self.id && !instance.isClosing) {
          instance.trigger("onDeactivate");

          instance.removeEvents();

          instance.isVisible = false;
        }
      });

      self.isVisible = true;

      if (self.current || self.isIdle) {
        self.update();

        self.updateControls();
      }

      self.trigger("onActivate");

      self.addEvents();
    },

    // Start closing procedure
    // This will start "zoom-out" animation if needed and clean everything up afterwards
    // =================================================================================

    close: function(e, d) {
      var self = this,
        current = self.current,
        effect,
        duration,
        $content,
        domRect,
        opacity,
        start,
        end;

      var done = function() {
        self.cleanUp(e);
      };

      if (self.isClosing) {
        return false;
      }

      self.isClosing = true;

      // If beforeClose callback prevents closing, make sure content is centered
      if (self.trigger("beforeClose", e) === false) {
        self.isClosing = false;

        requestAFrame(function() {
          self.update();
        });

        return false;
      }

      // Remove all events
      // If there are multiple instances, they will be set again by "activate" method
      self.removeEvents();

      if (current.timouts) {
        clearTimeout(current.timouts);
      }

      $content = current.$content;
      effect = current.opts.animationEffect;
      duration = $.isNumeric(d) ? d : effect ? current.opts.animationDuration : 0;

      // Remove other slides
      current.$slide
        .off(transitionEnd)
        .removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated");

      current.$slide
        .siblings()
        .trigger("onReset")
        .remove();

      // Trigger animations
      if (duration) {
        self.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing");
      }

      // Clean up
      self.hideLoading(current);

      self.hideControls();

      self.updateCursor();

      // Check if possible to zoom-out
      if (
        effect === "zoom" &&
        !(e !== true && $content && duration && current.type === "image" && !current.hasError && (end = self.getThumbPos(current)))
      ) {
        effect = "fade";
      }

      if (effect === "zoom") {
        $.fancybox.stop($content);

        domRect = $.fancybox.getTranslate($content);

        start = {
          top: domRect.top,
          left: domRect.left,
          scaleX: domRect.width / end.width,
          scaleY: domRect.height / end.height,
          width: end.width,
          height: end.height
        };

        // Check if we need to animate opacity
        opacity = current.opts.zoomOpacity;

        if (opacity == "auto") {
          opacity = Math.abs(current.width / current.height - end.width / end.height) > 0.1;
        }

        if (opacity) {
          end.opacity = 0;
        }

        $.fancybox.setTranslate($content, start);

        forceRedraw($content);

        $.fancybox.animate($content, end, duration, done);

        return true;
      }

      if (effect && duration) {
        // If skip animation
        if (e === true) {
          setTimeout(done, duration);
        } else {
          $.fancybox.animate(
            current.$slide.removeClass("fancybox-slide--current"),
            "fancybox-animated fancybox-slide--previous fancybox-fx-" + effect,
            duration,
            done
          );
        }
      } else {
        done();
      }

      return true;
    },

    // Final adjustments after removing the instance
    // =============================================

    cleanUp: function(e) {
      var self = this,
        $body = $("body"),
        instance,
        scrollTop;

      self.current.$slide.trigger("onReset");

      self.$refs.container.empty().remove();

      self.trigger("afterClose", e);

      // Place back focus
      if (self.$lastFocus && !!self.current.opts.backFocus) {
        self.$lastFocus.trigger("focus");
      }

      self.current = null;

      // Check if there are other instances
      instance = $.fancybox.getInstance();

      if (instance) {
        instance.activate();
      } else {
        $body.removeClass("fancybox-active compensate-for-scrollbar");

        $("#fancybox-style-noscroll").remove();
      }
    },

    // Call callback and trigger an event
    // ==================================

    trigger: function(name, slide) {
      var args = Array.prototype.slice.call(arguments, 1),
        self = this,
        obj = slide && slide.opts ? slide : self.current,
        rez;

      if (obj) {
        args.unshift(obj);
      } else {
        obj = self;
      }

      args.unshift(self);

      if ($.isFunction(obj.opts[name])) {
        rez = obj.opts[name].apply(obj, args);
      }

      if (rez === false) {
        return rez;
      }

      if (name === "afterClose" || !self.$refs) {
        $D.trigger(name + ".fb", args);
      } else {
        self.$refs.container.trigger(name + ".fb", args);
      }
    },

    // Update infobar values, navigation button states and reveal caption
    // ==================================================================

    updateControls: function(force) {
      var self = this,
        current = self.current,
        index = current.index,
        caption = current.opts.caption,
        $container = self.$refs.container,
        $caption = self.$refs.caption;

      // Recalculate content dimensions
      current.$slide.trigger("refresh");

      self.$caption = caption && caption.length ? $caption.html(caption) : null;

      if (!self.isHiddenControls && !self.isIdle) {
        self.showControls();
      }

      // Update info and navigation elements
      $container.find("[data-fancybox-count]").html(self.group.length);
      $container.find("[data-fancybox-index]").html(index + 1);

      $container.find("[data-fancybox-prev]").toggleClass("disabled", !current.opts.loop && index <= 0);
      $container.find("[data-fancybox-next]").toggleClass("disabled", !current.opts.loop && index >= self.group.length - 1);

      if (current.type === "image") {
        // Re-enable buttons; update download button source
        $container
          .find("[data-fancybox-zoom]")
          .show()
          .end()
          .find("[data-fancybox-download]")
          .attr("href", current.opts.image.src || current.src)
          .show();
      } else if (current.opts.toolbar) {
        $container.find("[data-fancybox-download],[data-fancybox-zoom]").hide();
      }
    },

    // Hide toolbar and caption
    // ========================

    hideControls: function() {
      this.isHiddenControls = true;

      this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav");
    },

    showControls: function() {
      var self = this,
        opts = self.current ? self.current.opts : self.opts,
        $container = self.$refs.container;

      self.isHiddenControls = false;
      self.idleSecondsCounter = 0;

      $container
        .toggleClass("fancybox-show-toolbar", !!(opts.toolbar && opts.buttons))
        .toggleClass("fancybox-show-infobar", !!(opts.infobar && self.group.length > 1))
        .toggleClass("fancybox-show-nav", !!(opts.arrows && self.group.length > 1))
        .toggleClass("fancybox-is-modal", !!opts.modal);

      if (self.$caption) {
        $container.addClass("fancybox-show-caption ");
      } else {
        $container.removeClass("fancybox-show-caption");
      }
    },

    // Toggle toolbar and caption
    // ==========================

    toggleControls: function() {
      if (this.isHiddenControls) {
        this.showControls();
      } else {
        this.hideControls();
      }
    }
  });

  $.fancybox = {
    version: "3.3.5",
    defaults: defaults,

    // Get current instance and execute a command.
    //
    // Examples of usage:
    //
    //   $instance = $.fancybox.getInstance();
    //   $.fancybox.getInstance().jumpTo( 1 );
    //   $.fancybox.getInstance( 'jumpTo', 1 );
    //   $.fancybox.getInstance( function() {
    //       console.info( this.currIndex );
    //   });
    // ======================================================

    getInstance: function(command) {
      var instance = $('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),
        args = Array.prototype.slice.call(arguments, 1);

      if (instance instanceof FancyBox) {
        if ($.type(command) === "string") {
          instance[command].apply(instance, args);
        } else if ($.type(command) === "function") {
          command.apply(instance, args);
        }

        return instance;
      }

      return false;
    },

    // Create new instance
    // ===================

    open: function(items, opts, index) {
      return new FancyBox(items, opts, index);
    },

    // Close current or all instances
    // ==============================

    close: function(all) {
      var instance = this.getInstance();

      if (instance) {
        instance.close();

        // Try to find and close next instance

        if (all === true) {
          this.close();
        }
      }
    },

    // Close all instances and unbind all events
    // =========================================

    destroy: function() {
      this.close(true);

      $D.add("body").off("click.fb-start", "**");
    },

    // Try to detect mobile devices
    // ============================

    isMobile:
      document.createTouch !== undefined && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    // Detect if 'translate3d' support is available
    // ============================================

    use3d: (function() {
      var div = document.createElement("div");

      return (
        window.getComputedStyle &&
        window.getComputedStyle(div) &&
        window.getComputedStyle(div).getPropertyValue("transform") &&
        !(document.documentMode && document.documentMode < 11)
      );
    })(),

    // Helper function to get current visual state of an element
    // returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
    // =====================================================================

    getTranslate: function($el) {
      var domRect;

      if (!$el || !$el.length) {
        return false;
      }

      domRect = $el[0].getBoundingClientRect();

      return {
        top: domRect.top || 0,
        left: domRect.left || 0,
        width: domRect.width,
        height: domRect.height,
        opacity: parseFloat($el.css("opacity"))
      };
    },

    // Shortcut for setting "translate3d" properties for element
    // Can set be used to set opacity, too
    // ========================================================

    setTranslate: function($el, props) {
      var str = "",
        css = {};

      if (!$el || !props) {
        return;
      }

      if (props.left !== undefined || props.top !== undefined) {
        str =
          (props.left === undefined ? $el.position().left : props.left) +
          "px, " +
          (props.top === undefined ? $el.position().top : props.top) +
          "px";

        if (this.use3d) {
          str = "translate3d(" + str + ", 0px)";
        } else {
          str = "translate(" + str + ")";
        }
      }

      if (props.scaleX !== undefined && props.scaleY !== undefined) {
        str = (str.length ? str + " " : "") + "scale(" + props.scaleX + ", " + props.scaleY + ")";
      }

      if (str.length) {
        css.transform = str;
      }

      if (props.opacity !== undefined) {
        css.opacity = props.opacity;
      }

      if (props.width !== undefined) {
        css.width = props.width;
      }

      if (props.height !== undefined) {
        css.height = props.height;
      }

      return $el.css(css);
    },

    // Simple CSS transition handler
    // =============================

    animate: function($el, to, duration, callback, leaveAnimationName) {
      var final = false;

      if ($.isFunction(duration)) {
        callback = duration;
        duration = null;
      }

      if (!$.isPlainObject(to)) {
        $el.removeAttr("style");
      }

      $.fancybox.stop($el);

      $el.on(transitionEnd, function(e) {
        // Skip events from child elements and z-index change
        if (e && e.originalEvent && (!$el.is(e.originalEvent.target) || e.originalEvent.propertyName == "z-index")) {
          return;
        }

        $.fancybox.stop($el);

        if (final) {
          $.fancybox.setTranslate($el, final);
        }

        if ($.isPlainObject(to)) {
          if (leaveAnimationName === false) {
            $el.removeAttr("style");
          }
        } else if (leaveAnimationName !== true) {
          $el.removeClass(to);
        }

        if ($.isFunction(callback)) {
          callback(e);
        }
      });

      if ($.isNumeric(duration)) {
        $el.css("transition-duration", duration + "ms");
      }

      // Start animation by changing CSS properties or class name
      if ($.isPlainObject(to)) {
        if (to.scaleX !== undefined && to.scaleY !== undefined) {
          final = $.extend({}, to, {
            width: $el.width() * to.scaleX,
            height: $el.height() * to.scaleY,
            scaleX: 1,
            scaleY: 1
          });

          delete to.width;
          delete to.height;

          if ($el.parent().hasClass("fancybox-slide--image")) {
            $el.parent().addClass("fancybox-is-scaling");
          }
        }

        $.fancybox.setTranslate($el, to);
      } else {
        $el.addClass(to);
      }

      // Make sure that `transitionend` callback gets fired
      $el.data(
        "timer",
        setTimeout(function() {
          $el.trigger("transitionend");
        }, duration + 16)
      );
    },

    stop: function($el) {
      if ($el && $el.length) {
        clearTimeout($el.data("timer"));

        $el.off("transitionend").css("transition-duration", "");

        $el.parent().removeClass("fancybox-is-scaling");
      }
    }
  };

  // Default click handler for "fancyboxed" links
  // ============================================

  function _run(e, opts) {
    var items = [],
      index = 0,
      $target,
      value;

    // Avoid opening multiple times
    if (e && e.isDefaultPrevented()) {
      return;
    }

    e.preventDefault();

    opts = e && e.data ? e.data.options : opts || {};

    $target = opts.$target || $(e.currentTarget);
    value = $target.attr("data-fancybox") || "";

    // Get all related items and find index for clicked one
    if (value) {
      items = opts.selector ? $(opts.selector) : e.data ? e.data.items : [];
      items = items.length ? items.filter('[data-fancybox="' + value + '"]') : $('[data-fancybox="' + value + '"]');

      index = items.index($target);

      // Sometimes current item can not be found (for example, if some script clones items)
      if (index < 0) {
        index = 0;
      }
    } else {
      items = [$target];
    }

    $.fancybox.open(items, opts, index);
  }

  // Create a jQuery plugin
  // ======================

  $.fn.fancybox = function(options) {
    var selector;

    options = options || {};
    selector = options.selector || false;

    if (selector) {
      // Use body element instead of document so it executes first
      $("body")
        .off("click.fb-start", selector)
        .on("click.fb-start", selector, {options: options}, _run);
    } else {
      this.off("click.fb-start").on(
        "click.fb-start",
        {
          items: this,
          options: options
        },
        _run
      );
    }

    return this;
  };

  // Self initializing plugin for all elements having `data-fancybox` attribute
  // ==========================================================================

  $D.on("click.fb-start", "[data-fancybox]", _run);

  // Enable "trigger elements"
  // =========================

  $D.on("click.fb-start", "[data-trigger]", function(e) {
    _run(e, {
      $target: $('[data-fancybox="' + $(e.currentTarget).attr("data-trigger") + '"]').eq($(e.currentTarget).attr("data-index") || 0),
      $trigger: $(this)
    });
  });
})(window, document, window.jQuery || jQuery);

// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================
(function($) {
  "use strict";

  // Formats matching url to final form

  var format = function(url, rez, params) {
    if (!url) {
      return;
    }

    params = params || "";

    if ($.type(params) === "object") {
      params = $.param(params, true);
    }

    $.each(rez, function(key, value) {
      url = url.replace("$" + key, value || "");
    });

    if (params.length) {
      url += (url.indexOf("?") > 0 ? "&" : "?") + params;
    }

    return url;
  };

  // Object containing properties for each media type

  var defaults = {
    youtube: {
      matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
      params: {
        autoplay: 1,
        autohide: 1,
        fs: 1,
        rel: 0,
        hd: 1,
        wmode: "transparent",
        enablejsapi: 1,
        html5: 1
      },
      paramPlace: 8,
      type: "iframe",
      url: "//www.youtube.com/embed/$4",
      thumb: "//img.youtube.com/vi/$4/hqdefault.jpg"
    },

    vimeo: {
      matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
      params: {
        autoplay: 1,
        hd: 1,
        show_title: 1,
        show_byline: 1,
        show_portrait: 0,
        fullscreen: 1,
        api: 1
      },
      paramPlace: 3,
      type: "iframe",
      url: "//player.vimeo.com/video/$2"
    },

    instagram: {
      matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
      type: "image",
      url: "//$1/p/$2/media/?size=l"
    },

    // Examples:
    // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
    // https://www.google.com/maps/@37.7852006,-122.4146355,14.65z
    // https://www.google.com/maps/@52.2111123,2.9237542,6.61z?hl=en
    // https://www.google.com/maps/place/Googleplex/@37.4220041,-122.0833494,17z/data=!4m5!3m4!1s0x0:0x6c296c66619367e0!8m2!3d37.4219998!4d-122.0840572
    gmap_place: {
      matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
      type: "iframe",
      url: function(rez) {
        return (
          "//maps.google." +
          rez[2] +
          "/?ll=" +
          (rez[9] ? rez[9] + "&z=" + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : "") : rez[12] + "").replace(/\?/, "&") +
          "&output=" +
          (rez[12] && rez[12].indexOf("layer=c") > 0 ? "svembed" : "embed")
        );
      }
    },

    // Examples:
    // https://www.google.com/maps/search/Empire+State+Building/
    // https://www.google.com/maps/search/?api=1&query=centurylink+field
    // https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393
    gmap_search: {
      matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
      type: "iframe",
      url: function(rez) {
        return "//maps.google." + rez[2] + "/maps?q=" + rez[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
      }
    }
  };

  $(document).on("objectNeedsType.fb", function(e, instance, item) {
    var url = item.src || "",
      type = false,
      media,
      thumb,
      rez,
      params,
      urlParams,
      paramObj,
      provider;

    media = $.extend(true, {}, defaults, item.opts.media);

    // Look for any matching media type
    $.each(media, function(providerName, providerOpts) {
      rez = url.match(providerOpts.matcher);

      if (!rez) {
        return;
      }

      type = providerOpts.type;
      provider = providerName;
      paramObj = {};

      if (providerOpts.paramPlace && rez[providerOpts.paramPlace]) {
        urlParams = rez[providerOpts.paramPlace];

        if (urlParams[0] == "?") {
          urlParams = urlParams.substring(1);
        }

        urlParams = urlParams.split("&");

        for (var m = 0; m < urlParams.length; ++m) {
          var p = urlParams[m].split("=", 2);

          if (p.length == 2) {
            paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
          }
        }
      }

      params = $.extend(true, {}, providerOpts.params, item.opts[providerName], paramObj);

      url =
        $.type(providerOpts.url) === "function" ? providerOpts.url.call(this, rez, params, item) : format(providerOpts.url, rez, params);

      thumb =
        $.type(providerOpts.thumb) === "function" ? providerOpts.thumb.call(this, rez, params, item) : format(providerOpts.thumb, rez);

      if (providerName === "youtube") {
        url = url.replace(/&t=((\d+)m)?(\d+)s/, function(match, p1, m, s) {
          return "&start=" + ((m ? parseInt(m, 10) * 60 : 0) + parseInt(s, 10));
        });
      } else if (providerName === "vimeo") {
        url = url.replace("&%23", "#");
      }

      return false;
    });

    // If it is found, then change content type and update the url

    if (type) {
      if (!item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length)) {
        item.opts.thumb = thumb;
      }

      if (type === "iframe") {
        item.opts = $.extend(true, item.opts, {
          iframe: {
            preload: false,
            attr: {
              scrolling: "no"
            }
          }
        });
      }

      $.extend(item, {
        type: type,
        src: url,
        origSrc: item.src,
        contentSource: provider,
        contentType: type === "image" ? "image" : provider == "gmap_place" || provider == "gmap_search" ? "map" : "video"
      });
    } else if (url) {
      item.type = item.opts.defaultType;
    }
  });
})(window.jQuery || jQuery);

// ==========================================================================
//
// Guestures
// Adds touch guestures, handles click and tap events
//
// ==========================================================================
(function(window, document, $) {
  "use strict";

  var requestAFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      // if all else fails, use setTimeout
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  var cancelAFrame = (function() {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      function(id) {
        window.clearTimeout(id);
      }
    );
  })();

  var getPointerXY = function(e) {
    var result = [];

    e = e.originalEvent || e || window.e;
    e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];

    for (var key in e) {
      if (e[key].pageX) {
        result.push({
          x: e[key].pageX,
          y: e[key].pageY
        });
      } else if (e[key].clientX) {
        result.push({
          x: e[key].clientX,
          y: e[key].clientY
        });
      }
    }

    return result;
  };

  var distance = function(point2, point1, what) {
    if (!point1 || !point2) {
      return 0;
    }

    if (what === "x") {
      return point2.x - point1.x;
    } else if (what === "y") {
      return point2.y - point1.y;
    }

    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };

  var isClickable = function($el) {
    if (
      $el.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio') ||
      $.isFunction($el.get(0).onclick) ||
      $el.data("selectable")
    ) {
      return true;
    }

    // Check for attributes like data-fancybox-next or data-fancybox-close
    for (var i = 0, atts = $el[0].attributes, n = atts.length; i < n; i++) {
      if (atts[i].nodeName.substr(0, 14) === "data-fancybox-") {
        return true;
      }
    }

    return false;
  };

  var hasScrollbars = function(el) {
    var overflowY = window.getComputedStyle(el)["overflow-y"],
      overflowX = window.getComputedStyle(el)["overflow-x"],
      vertical = (overflowY === "scroll" || overflowY === "auto") && el.scrollHeight > el.clientHeight,
      horizontal = (overflowX === "scroll" || overflowX === "auto") && el.scrollWidth > el.clientWidth;

    return vertical || horizontal;
  };

  var isScrollable = function($el) {
    var rez = false;

    while (true) {
      rez = hasScrollbars($el.get(0));

      if (rez) {
        break;
      }

      $el = $el.parent();

      if (!$el.length || $el.hasClass("fancybox-stage") || $el.is("body")) {
        break;
      }
    }

    return rez;
  };

  var Guestures = function(instance) {
    var self = this;

    self.instance = instance;

    self.$bg = instance.$refs.bg;
    self.$stage = instance.$refs.stage;
    self.$container = instance.$refs.container;

    self.destroy();

    self.$container.on("touchstart.fb.touch mousedown.fb.touch", $.proxy(self, "ontouchstart"));
  };

  Guestures.prototype.destroy = function() {
    this.$container.off(".fb.touch");
  };

  Guestures.prototype.ontouchstart = function(e) {
    var self = this,
      $target = $(e.target),
      instance = self.instance,
      current = instance.current,
      $content = current.$content,
      isTouchDevice = e.type == "touchstart";

    // Do not respond to both (touch and mouse) events
    if (isTouchDevice) {
      self.$container.off("mousedown.fb.touch");
    }

    // Ignore right click
    if (e.originalEvent && e.originalEvent.button == 2) {
      return;
    }

    // Ignore taping on links, buttons, input elements
    if (!$target.length || isClickable($target) || isClickable($target.parent())) {
      return;
    }

    // Ignore clicks on the scrollbar
    if (!$target.is("img") && e.originalEvent.clientX > $target[0].clientWidth + $target.offset().left) {
      return;
    }

    // Ignore clicks while zooming or closing
    if (!current || instance.isAnimating || instance.isClosing) {
      e.stopPropagation();
      e.preventDefault();

      return;
    }

    self.realPoints = self.startPoints = getPointerXY(e);

    if (!self.startPoints.length) {
      return;
    }

    e.stopPropagation();

    self.startEvent = e;

    self.canTap = true;
    self.$target = $target;
    self.$content = $content;
    self.opts = current.opts.touch;

    self.isPanning = false;
    self.isSwiping = false;
    self.isZooming = false;
    self.isScrolling = false;

    self.startTime = new Date().getTime();
    self.distanceX = self.distanceY = self.distance = 0;

    self.canvasWidth = Math.round(current.$slide[0].clientWidth);
    self.canvasHeight = Math.round(current.$slide[0].clientHeight);

    self.contentLastPos = null;
    self.contentStartPos = $.fancybox.getTranslate(self.$content) || {top: 0, left: 0};
    self.sliderStartPos = self.sliderLastPos || $.fancybox.getTranslate(current.$slide);

    // Since position will be absolute, but we need to make it relative to the stage
    self.stagePos = $.fancybox.getTranslate(instance.$refs.stage);

    self.sliderStartPos.top -= self.stagePos.top;
    self.sliderStartPos.left -= self.stagePos.left;

    self.contentStartPos.top -= self.stagePos.top;
    self.contentStartPos.left -= self.stagePos.left;

    $(document)
      .off(".fb.touch")
      .on(isTouchDevice ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", $.proxy(self, "ontouchend"))
      .on(isTouchDevice ? "touchmove.fb.touch" : "mousemove.fb.touch", $.proxy(self, "ontouchmove"));

    if ($.fancybox.isMobile) {
      document.addEventListener("scroll", self.onscroll, true);
    }

    if (!(self.opts || instance.canPan()) || !($target.is(self.$stage) || self.$stage.find($target).length)) {
      if ($target.is(".fancybox-image")) {
        e.preventDefault();
      }

      return;
    }

    if (!($.fancybox.isMobile && (isScrollable($target) || isScrollable($target.parent())))) {
      e.preventDefault();
    }

    if (self.startPoints.length === 1 || current.hasError) {
      if (self.instance.canPan()) {
        $.fancybox.stop(self.$content);

        self.$content.css("transition-duration", "");

        self.isPanning = true;
      } else {
        self.isSwiping = true;
      }

      self.$container.addClass("fancybox-controls--isGrabbing");
    }

    if (self.startPoints.length === 2 && current.type === "image" && (current.isLoaded || current.$ghost)) {
      self.canTap = false;
      self.isSwiping = false;
      self.isPanning = false;

      self.isZooming = true;

      $.fancybox.stop(self.$content);

      self.$content.css("transition-duration", "");

      self.centerPointStartX = (self.startPoints[0].x + self.startPoints[1].x) * 0.5 - $(window).scrollLeft();
      self.centerPointStartY = (self.startPoints[0].y + self.startPoints[1].y) * 0.5 - $(window).scrollTop();

      self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
      self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;

      self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
    }
  };

  Guestures.prototype.onscroll = function(e) {
    var self = this;

    self.isScrolling = true;

    document.removeEventListener("scroll", self.onscroll, true);
  };

  Guestures.prototype.ontouchmove = function(e) {
    var self = this,
      $target = $(e.target);

    // Make sure user has not released over iframe or disabled element
    if (e.originalEvent.buttons !== undefined && e.originalEvent.buttons === 0) {
      self.ontouchend(e);
      return;
    }

    if (self.isScrolling || !($target.is(self.$stage) || self.$stage.find($target).length)) {
      self.canTap = false;

      return;
    }

    self.newPoints = getPointerXY(e);

    if (!(self.opts || self.instance.canPan()) || !self.newPoints.length || !self.newPoints.length) {
      return;
    }

    if (!(self.isSwiping && self.isSwiping === true)) {
      e.preventDefault();
    }

    self.distanceX = distance(self.newPoints[0], self.startPoints[0], "x");
    self.distanceY = distance(self.newPoints[0], self.startPoints[0], "y");

    self.distance = distance(self.newPoints[0], self.startPoints[0]);

    // Skip false ontouchmove events (Chrome)
    if (self.distance > 0) {
      if (self.isSwiping) {
        self.onSwipe(e);
      } else if (self.isPanning) {
        self.onPan();
      } else if (self.isZooming) {
        self.onZoom();
      }
    }
  };

  Guestures.prototype.onSwipe = function(e) {
    var self = this,
      swiping = self.isSwiping,
      left = self.sliderStartPos.left || 0,
      angle;

    // If direction is not yet determined
    if (swiping === true) {
      // We need at least 10px distance to correctly calculate an angle
      if (Math.abs(self.distance) > 10) {
        self.canTap = false;

        if (self.instance.group.length < 2 && self.opts.vertical) {
          self.isSwiping = "y";
        } else if (self.instance.isDragging || self.opts.vertical === false || (self.opts.vertical === "auto" && $(window).width() > 800)) {
          self.isSwiping = "x";
        } else {
          angle = Math.abs(Math.atan2(self.distanceY, self.distanceX) * 180 / Math.PI);

          self.isSwiping = angle > 45 && angle < 135 ? "y" : "x";
        }

        self.canTap = false;

        if (self.isSwiping === "y" && $.fancybox.isMobile && (isScrollable(self.$target) || isScrollable(self.$target.parent()))) {
          self.isScrolling = true;

          return;
        }

        self.instance.isDragging = self.isSwiping;

        // Reset points to avoid jumping, because we dropped first swipes to calculate the angle
        self.startPoints = self.newPoints;

        $.each(self.instance.slides, function(index, slide) {
          $.fancybox.stop(slide.$slide);

          slide.$slide.css("transition-duration", "");

          slide.inTransition = false;

          if (slide.pos === self.instance.current.pos) {
            self.sliderStartPos.left = $.fancybox.getTranslate(slide.$slide).left - $.fancybox.getTranslate(self.instance.$refs.stage).left;
          }
        });

        // Stop slideshow
        if (self.instance.SlideShow && self.instance.SlideShow.isActive) {
          self.instance.SlideShow.stop();
        }
      }

      return;
    }

    // Sticky edges
    if (swiping == "x") {
      if (
        self.distanceX > 0 &&
        (self.instance.group.length < 2 || (self.instance.current.index === 0 && !self.instance.current.opts.loop))
      ) {
        left = left + Math.pow(self.distanceX, 0.8);
      } else if (
        self.distanceX < 0 &&
        (self.instance.group.length < 2 ||
          (self.instance.current.index === self.instance.group.length - 1 && !self.instance.current.opts.loop))
      ) {
        left = left - Math.pow(-self.distanceX, 0.8);
      } else {
        left = left + self.distanceX;
      }
    }

    self.sliderLastPos = {
      top: swiping == "x" ? 0 : self.sliderStartPos.top + self.distanceY,
      left: left
    };

    if (self.requestId) {
      cancelAFrame(self.requestId);

      self.requestId = null;
    }

    self.requestId = requestAFrame(function() {
      if (self.sliderLastPos) {
        $.each(self.instance.slides, function(index, slide) {
          var pos = slide.pos - self.instance.currPos;

          $.fancybox.setTranslate(slide.$slide, {
            top: self.sliderLastPos.top,
            left: self.sliderLastPos.left + pos * self.canvasWidth + pos * slide.opts.gutter
          });
        });

        self.$container.addClass("fancybox-is-sliding");
      }
    });
  };

  Guestures.prototype.onPan = function() {
    var self = this;

    // Prevent accidental movement (sometimes, when tapping casually, finger can move a bit)
    if (distance(self.newPoints[0], self.realPoints[0]) < ($.fancybox.isMobile ? 10 : 5)) {
      self.startPoints = self.newPoints;
      return;
    }

    self.canTap = false;

    self.contentLastPos = self.limitMovement();

    if (self.requestId) {
      cancelAFrame(self.requestId);

      self.requestId = null;
    }

    self.requestId = requestAFrame(function() {
      $.fancybox.setTranslate(self.$content, self.contentLastPos);
    });
  };

  // Make panning sticky to the edges
  Guestures.prototype.limitMovement = function() {
    var self = this;

    var canvasWidth = self.canvasWidth;
    var canvasHeight = self.canvasHeight;

    var distanceX = self.distanceX;
    var distanceY = self.distanceY;

    var contentStartPos = self.contentStartPos;

    var currentOffsetX = contentStartPos.left;
    var currentOffsetY = contentStartPos.top;

    var currentWidth = contentStartPos.width;
    var currentHeight = contentStartPos.height;

    var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY, newOffsetX, newOffsetY;

    if (currentWidth > canvasWidth) {
      newOffsetX = currentOffsetX + distanceX;
    } else {
      newOffsetX = currentOffsetX;
    }

    newOffsetY = currentOffsetY + distanceY;

    // Slow down proportionally to traveled distance
    minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
    minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);

    maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
    maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5);

    //   ->
    if (distanceX > 0 && newOffsetX > minTranslateX) {
      newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
    }

    //    <-
    if (distanceX < 0 && newOffsetX < maxTranslateX) {
      newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
    }

    //   \/
    if (distanceY > 0 && newOffsetY > minTranslateY) {
      newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
    }

    //   /\
    if (distanceY < 0 && newOffsetY < maxTranslateY) {
      newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
    }

    return {
      top: newOffsetY,
      left: newOffsetX
    };
  };

  Guestures.prototype.limitPosition = function(newOffsetX, newOffsetY, newWidth, newHeight) {
    var self = this;

    var canvasWidth = self.canvasWidth;
    var canvasHeight = self.canvasHeight;

    if (newWidth > canvasWidth) {
      newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
      newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
    } else {
      // Center horizontally
      newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
    }

    if (newHeight > canvasHeight) {
      newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
      newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
    } else {
      // Center vertically
      newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
    }

    return {
      top: newOffsetY,
      left: newOffsetX
    };
  };

  Guestures.prototype.onZoom = function() {
    var self = this;

    // Calculate current distance between points to get pinch ratio and new width and height
    var contentStartPos = self.contentStartPos;

    var currentWidth = contentStartPos.width;
    var currentHeight = contentStartPos.height;

    var currentOffsetX = contentStartPos.left;
    var currentOffsetY = contentStartPos.top;

    var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);

    var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;

    var newWidth = Math.floor(currentWidth * pinchRatio);
    var newHeight = Math.floor(currentHeight * pinchRatio);

    // This is the translation due to pinch-zooming
    var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
    var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;

    // Point between the two touches
    var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - $(window).scrollLeft();
    var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - $(window).scrollTop();

    // And this is the translation due to translation of the centerpoint
    // between the two fingers
    var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
    var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;

    // The new offset is the old/current one plus the total translation
    var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
    var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);

    var newPos = {
      top: newOffsetY,
      left: newOffsetX,
      scaleX: pinchRatio,
      scaleY: pinchRatio
    };

    self.canTap = false;

    self.newWidth = newWidth;
    self.newHeight = newHeight;

    self.contentLastPos = newPos;

    if (self.requestId) {
      cancelAFrame(self.requestId);

      self.requestId = null;
    }

    self.requestId = requestAFrame(function() {
      $.fancybox.setTranslate(self.$content, self.contentLastPos);
    });
  };

  Guestures.prototype.ontouchend = function(e) {
    var self = this;
    var dMs = Math.max(new Date().getTime() - self.startTime, 1);

    var swiping = self.isSwiping;
    var panning = self.isPanning;
    var zooming = self.isZooming;
    var scrolling = self.isScrolling;

    self.endPoints = getPointerXY(e);

    self.$container.removeClass("fancybox-controls--isGrabbing");

    $(document).off(".fb.touch");

    document.removeEventListener("scroll", self.onscroll, true);

    if (self.requestId) {
      cancelAFrame(self.requestId);

      self.requestId = null;
    }

    self.isSwiping = false;
    self.isPanning = false;
    self.isZooming = false;
    self.isScrolling = false;

    self.instance.isDragging = false;

    if (self.canTap) {
      return self.onTap(e);
    }

    self.speed = 366;

    // Speed in px/ms
    self.velocityX = self.distanceX / dMs * 0.5;
    self.velocityY = self.distanceY / dMs * 0.5;

    self.speedX = Math.max(self.speed * 0.5, Math.min(self.speed * 1.5, 1 / Math.abs(self.velocityX) * self.speed));

    if (panning) {
      self.endPanning();
    } else if (zooming) {
      self.endZooming();
    } else {
      self.endSwiping(swiping, scrolling);
    }

    return;
  };

  Guestures.prototype.endSwiping = function(swiping, scrolling) {
    var self = this,
      ret = false,
      len = self.instance.group.length;

    self.sliderLastPos = null;

    // Close if swiped vertically / navigate if horizontally
    if (swiping == "y" && !scrolling && Math.abs(self.distanceY) > 50) {
      // Continue vertical movement
      $.fancybox.animate(
        self.instance.current.$slide,
        {
          top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
          opacity: 0
        },
        200
      );

      ret = self.instance.close(true, 200);
    } else if (swiping == "x" && self.distanceX > 50 && len > 1) {
      ret = self.instance.previous(self.speedX);
    } else if (swiping == "x" && self.distanceX < -50 && len > 1) {
      ret = self.instance.next(self.speedX);
    }

    if (ret === false && (swiping == "x" || swiping == "y")) {
      if (scrolling || len < 2) {
        self.instance.centerSlide(self.instance.current, 150);
      } else {
        self.instance.jumpTo(self.instance.current.index);
      }
    }

    self.$container.removeClass("fancybox-is-sliding");
  };

  // Limit panning from edges
  // ========================
  Guestures.prototype.endPanning = function() {
    var self = this;
    var newOffsetX, newOffsetY, newPos;

    if (!self.contentLastPos) {
      return;
    }

    if (self.opts.momentum === false) {
      newOffsetX = self.contentLastPos.left;
      newOffsetY = self.contentLastPos.top;
    } else {
      // Continue movement
      newOffsetX = self.contentLastPos.left + self.velocityX * self.speed;
      newOffsetY = self.contentLastPos.top + self.velocityY * self.speed;
    }

    newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);

    newPos.width = self.contentStartPos.width;
    newPos.height = self.contentStartPos.height;

    $.fancybox.animate(self.$content, newPos, 330);
  };

  Guestures.prototype.endZooming = function() {
    var self = this;

    var current = self.instance.current;

    var newOffsetX, newOffsetY, newPos, reset;

    var newWidth = self.newWidth;
    var newHeight = self.newHeight;

    if (!self.contentLastPos) {
      return;
    }

    newOffsetX = self.contentLastPos.left;
    newOffsetY = self.contentLastPos.top;

    reset = {
      top: newOffsetY,
      left: newOffsetX,
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1
    };

    // Reset scalex/scaleY values; this helps for perfomance and does not break animation
    $.fancybox.setTranslate(self.$content, reset);

    if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
      self.instance.scaleToFit(150);
    } else if (newWidth > current.width || newHeight > current.height) {
      self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);
    } else {
      newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);

      // Switch from scale() to width/height or animation will not work correctly
      $.fancybox.setTranslate(self.$content, $.fancybox.getTranslate(self.$content));

      $.fancybox.animate(self.$content, newPos, 150);
    }
  };

  Guestures.prototype.onTap = function(e) {
    var self = this;
    var $target = $(e.target);

    var instance = self.instance;
    var current = instance.current;

    var endPoints = (e && getPointerXY(e)) || self.startPoints;

    var tapX = endPoints[0] ? endPoints[0].x - $(window).scrollLeft() - self.stagePos.left : 0;
    var tapY = endPoints[0] ? endPoints[0].y - $(window).scrollTop() - self.stagePos.top : 0;

    var where;

    var process = function(prefix) {
      var action = current.opts[prefix];

      if ($.isFunction(action)) {
        action = action.apply(instance, [current, e]);
      }

      if (!action) {
        return;
      }

      switch (action) {
        case "close":
          instance.close(self.startEvent);

          break;

        case "toggleControls":
          instance.toggleControls(true);

          break;

        case "next":
          instance.next();

          break;

        case "nextOrClose":
          if (instance.group.length > 1) {
            instance.next();
          } else {
            instance.close(self.startEvent);
          }

          break;

        case "zoom":
          if (current.type == "image" && (current.isLoaded || current.$ghost)) {
            if (instance.canPan()) {
              instance.scaleToFit();
            } else if (instance.isScaledDown()) {
              instance.scaleToActual(tapX, tapY);
            } else if (instance.group.length < 2) {
              instance.close(self.startEvent);
            }
          }

          break;
      }
    };

    // Ignore right click
    if (e.originalEvent && e.originalEvent.button == 2) {
      return;
    }

    // Skip if clicked on the scrollbar
    if (!$target.is("img") && tapX > $target[0].clientWidth + $target.offset().left) {
      return;
    }

    // Check where is clicked
    if ($target.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) {
      where = "Outside";
    } else if ($target.is(".fancybox-slide")) {
      where = "Slide";
    } else if (
      instance.current.$content &&
      instance.current.$content
        .find($target)
        //.addBack()
        .filter($target).length
    ) {
      where = "Content";
    } else {
      return;
    }

    // Check if this is a double tap
    if (self.tapped) {
      // Stop previously created single tap
      clearTimeout(self.tapped);
      self.tapped = null;

      // Skip if distance between taps is too big
      if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50) {
        return this;
      }

      // OK, now we assume that this is a double-tap
      process("dblclick" + where);
    } else {
      // Single tap will be processed if user has not clicked second time within 300ms
      // or there is no need to wait for double-tap
      self.tapX = tapX;
      self.tapY = tapY;

      if (current.opts["dblclick" + where] && current.opts["dblclick" + where] !== current.opts["click" + where]) {
        self.tapped = setTimeout(function() {
          self.tapped = null;

          process("click" + where);
        }, 500);
      } else {
        process("click" + where);
      }
    }

    return this;
  };

  $(document).on("onActivate.fb", function(e, instance) {
    if (instance && !instance.Guestures) {
      instance.Guestures = new Guestures(instance);
    }
  });
})(window, document, window.jQuery || jQuery);

// ==========================================================================
//
// SlideShow
// Enables slideshow functionality
//
// Example of usage:
// $.fancybox.getInstance().SlideShow.start()
//
// ==========================================================================
(function(document, $) {
  "use strict";

  $.extend(true, $.fancybox.defaults, {
    btnTpl: {
      slideShow:
        '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M13,12 L27,20 L13,27 Z" />' +
        '<path d="M15,10 v19 M23,10 v19" />' +
        "</svg>" +
        "</button>"
    },
    slideShow: {
      autoStart: false,
      speed: 3000
    }
  });

  var SlideShow = function(instance) {
    this.instance = instance;
    this.init();
  };

  $.extend(SlideShow.prototype, {
    timer: null,
    isActive: false,
    $button: null,

    init: function() {
      var self = this;

      self.$button = self.instance.$refs.toolbar.find("[data-fancybox-play]").on("click", function() {
        self.toggle();
      });

      if (self.instance.group.length < 2 || !self.instance.group[self.instance.currIndex].opts.slideShow) {
        self.$button.hide();
      }
    },

    set: function(force) {
      var self = this;

      // Check if reached last element
      if (
        self.instance &&
        self.instance.current &&
        (force === true || self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1)
      ) {
        self.timer = setTimeout(function() {
          if (self.isActive) {
            self.instance.jumpTo((self.instance.currIndex + 1) % self.instance.group.length);
          }
        }, self.instance.current.opts.slideShow.speed);
      } else {
        self.stop();
        self.instance.idleSecondsCounter = 0;
        self.instance.showControls();
      }
    },

    clear: function() {
      var self = this;

      clearTimeout(self.timer);

      self.timer = null;
    },

    start: function() {
      var self = this;
      var current = self.instance.current;

      if (current) {
        self.isActive = true;

        self.$button
          .attr("title", current.opts.i18n[current.opts.lang].PLAY_STOP)
          .removeClass("fancybox-button--play")
          .addClass("fancybox-button--pause");

        self.set(true);
      }
    },

    stop: function() {
      var self = this;
      var current = self.instance.current;

      self.clear();

      self.$button
        .attr("title", current.opts.i18n[current.opts.lang].PLAY_START)
        .removeClass("fancybox-button--pause")
        .addClass("fancybox-button--play");

      self.isActive = false;
    },

    toggle: function() {
      var self = this;

      if (self.isActive) {
        self.stop();
      } else {
        self.start();
      }
    }
  });

  $(document).on({
    "onInit.fb": function(e, instance) {
      if (instance && !instance.SlideShow) {
        instance.SlideShow = new SlideShow(instance);
      }
    },

    "beforeShow.fb": function(e, instance, current, firstRun) {
      var SlideShow = instance && instance.SlideShow;

      if (firstRun) {
        if (SlideShow && current.opts.slideShow.autoStart) {
          SlideShow.start();
        }
      } else if (SlideShow && SlideShow.isActive) {
        SlideShow.clear();
      }
    },

    "afterShow.fb": function(e, instance, current) {
      var SlideShow = instance && instance.SlideShow;

      if (SlideShow && SlideShow.isActive) {
        SlideShow.set();
      }
    },

    "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
      var SlideShow = instance && instance.SlideShow;

      // "P" or Spacebar
      if (SlideShow && current.opts.slideShow && (keycode === 80 || keycode === 32) && !$(document.activeElement).is("button,a,input")) {
        keypress.preventDefault();

        SlideShow.toggle();
      }
    },

    "beforeClose.fb onDeactivate.fb": function(e, instance) {
      var SlideShow = instance && instance.SlideShow;

      if (SlideShow) {
        SlideShow.stop();
      }
    }
  });

  // Page Visibility API to pause slideshow when window is not active
  $(document).on("visibilitychange", function() {
    var instance = $.fancybox.getInstance();
    var SlideShow = instance && instance.SlideShow;

    if (SlideShow && SlideShow.isActive) {
      if (document.hidden) {
        SlideShow.clear();
      } else {
        SlideShow.set();
      }
    }
  });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// FullScreen
// Adds fullscreen functionality
//
// ==========================================================================
(function(document, $) {
  "use strict";

  // Collection of methods supported by user browser
  var fn = (function() {
    var fnMap = [
      ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
      // new WebKit
      [
        "webkitRequestFullscreen",
        "webkitExitFullscreen",
        "webkitFullscreenElement",
        "webkitFullscreenEnabled",
        "webkitfullscreenchange",
        "webkitfullscreenerror"
      ],
      // old WebKit (Safari 5.1)
      [
        "webkitRequestFullScreen",
        "webkitCancelFullScreen",
        "webkitCurrentFullScreenElement",
        "webkitCancelFullScreen",
        "webkitfullscreenchange",
        "webkitfullscreenerror"
      ],
      [
        "mozRequestFullScreen",
        "mozCancelFullScreen",
        "mozFullScreenElement",
        "mozFullScreenEnabled",
        "mozfullscreenchange",
        "mozfullscreenerror"
      ],
      ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
    ];

    var ret = {};

    for (var i = 0; i < fnMap.length; i++) {
      var val = fnMap[i];

      if (val && val[1] in document) {
        for (var j = 0; j < val.length; j++) {
          ret[fnMap[0][j]] = val[j];
        }

        return ret;
      }
    }

    return false;
  })();

  // If browser does not have Full Screen API, then simply unset default button template and stop
  if (!fn) {
    if ($ && $.fancybox) {
      $.fancybox.defaults.btnTpl.fullScreen = false;
    }

    return;
  }

  var FullScreen = {
    request: function(elem) {
      elem = elem || document.documentElement;

      elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
    },
    exit: function() {
      document[fn.exitFullscreen]();
    },
    toggle: function(elem) {
      elem = elem || document.documentElement;

      if (this.isFullscreen()) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    isFullscreen: function() {
      return Boolean(document[fn.fullscreenElement]);
    },
    enabled: function() {
      return Boolean(document[fn.fullscreenEnabled]);
    }
  };

  $.extend(true, $.fancybox.defaults, {
    btnTpl: {
      fullScreen:
        '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M9,12 v16 h22 v-16 h-22 v8" />' +
        "</svg>" +
        "</button>"
    },
    fullScreen: {
      autoStart: false
    }
  });

  $(document).on({
    "onInit.fb": function(e, instance) {
      var $container;

      if (instance && instance.group[instance.currIndex].opts.fullScreen) {
        $container = instance.$refs.container;

        $container.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function(e) {
          e.stopPropagation();
          e.preventDefault();

          FullScreen.toggle();
        });

        if (instance.opts.fullScreen && instance.opts.fullScreen.autoStart === true) {
          FullScreen.request();
        }

        // Expose API
        instance.FullScreen = FullScreen;
      } else if (instance) {
        instance.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();
      }
    },

    "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
      // "F"
      if (instance && instance.FullScreen && keycode === 70) {
        keypress.preventDefault();

        instance.FullScreen.toggle();
      }
    },

    "beforeClose.fb": function(e, instance) {
      if (instance && instance.FullScreen && instance.$refs.container.hasClass("fancybox-is-fullscreen")) {
        FullScreen.exit();
      }
    }
  });

  $(document).on(fn.fullscreenchange, function() {
    var isFullscreen = FullScreen.isFullscreen(),
      instance = $.fancybox.getInstance();

    if (instance) {
      // If image is zooming, then force to stop and reposition properly
      if (instance.current && instance.current.type === "image" && instance.isAnimating) {
        instance.current.$content.css("transition", "none");

        instance.isAnimating = false;

        instance.update(true, true, 0);
      }

      instance.trigger("onFullscreenChange", isFullscreen);

      instance.$refs.container.toggleClass("fancybox-is-fullscreen", isFullscreen);
    }
  });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
(function(document, $) {
  "use strict";

  var CLASS = "fancybox-thumbs",
    CLASS_ACTIVE = CLASS + "-active",
    CLASS_LOAD = CLASS + "-loading";

  // Make sure there are default values
  $.fancybox.defaults = $.extend(
    true,
    {
      btnTpl: {
        thumbs:
          '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">' +
          '<svg viewBox="0 0 120 120">' +
          '<path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" />' +
          "</svg>" +
          "</button>"
      },
      thumbs: {
        autoStart: false, // Display thumbnails on opening
        hideOnClose: true, // Hide thumbnail grid when closing animation starts
        parentEl: ".fancybox-container", // Container is injected into this element
        axis: "y" // Vertical (y) or horizontal (x) scrolling
      }
    },
    $.fancybox.defaults
  );

  var FancyThumbs = function(instance) {
    this.init(instance);
  };

  $.extend(FancyThumbs.prototype, {
    $button: null,
    $grid: null,
    $list: null,
    isVisible: false,
    isActive: false,

    init: function(instance) {
      var self = this,
        first,
        second;

      self.instance = instance;

      instance.Thumbs = self;

      self.opts = instance.group[instance.currIndex].opts.thumbs;

      // Enable thumbs if at least two group items have thumbnails
      first = instance.group[0];
      first = first.opts.thumb || (first.opts.$thumb && first.opts.$thumb.length ? first.opts.$thumb.attr("src") : false);

      if (instance.group.length > 1) {
        second = instance.group[1];
        second = second.opts.thumb || (second.opts.$thumb && second.opts.$thumb.length ? second.opts.$thumb.attr("src") : false);
      }

      self.$button = instance.$refs.toolbar.find("[data-fancybox-thumbs]");

      if (self.opts && first && second && first && second) {
        self.$button.show().on("click", function() {
          self.toggle();
        });

        self.isActive = true;
      } else {
        self.$button.hide();
      }
    },

    create: function() {
      var self = this,
        instance = self.instance,
        parentEl = self.opts.parentEl,
        list = [],
        src;

      if (!self.$grid) {
        // Create main element
        self.$grid = $('<div class="' + CLASS + " " + CLASS + "-" + self.opts.axis + '"></div>').appendTo(
          instance.$refs.container
            .find(parentEl)
            .addBack()
            .filter(parentEl)
        );

        // Add "click" event that performs gallery navigation
        self.$grid.on("click", "li", function() {
          instance.jumpTo($(this).attr("data-index"));
        });
      }

      // Build the list
      if (!self.$list) {
        self.$list = $("<ul>").appendTo(self.$grid);
      }

      $.each(instance.group, function(i, item) {
        src = item.opts.thumb || (item.opts.$thumb ? item.opts.$thumb.attr("src") : null);

        if (!src && item.type === "image") {
          src = item.src;
        }

        list.push(
          '<li data-index="' +
            i +
            '" tabindex="0" class="' +
            CLASS_LOAD +
            '"' +
            (src && src.length ? ' style="background-image:url(' + src + ')" />' : "") +
            "></li>"
        );
      });

      self.$list[0].innerHTML = list.join("");

      if (self.opts.axis === "x") {
        // Set fixed width for list element to enable horizontal scrolling
        self.$list.width(
          parseInt(self.$grid.css("padding-right"), 10) +
            instance.group.length *
              self.$list
                .children()
                .eq(0)
                .outerWidth(true)
        );
      }
    },

    focus: function(duration) {
      var self = this,
        $list = self.$list,
        $grid = self.$grid,
        thumb,
        thumbPos;

      if (!self.instance.current) {
        return;
      }

      thumb = $list
        .children()
        .removeClass(CLASS_ACTIVE)
        .filter('[data-index="' + self.instance.current.index + '"]')
        .addClass(CLASS_ACTIVE);

      thumbPos = thumb.position();

      // Check if need to scroll to make current thumb visible
      if (self.opts.axis === "y" && (thumbPos.top < 0 || thumbPos.top > $list.height() - thumb.outerHeight())) {
        $list.stop().animate(
          {
            scrollTop: $list.scrollTop() + thumbPos.top
          },
          duration
        );
      } else if (
        self.opts.axis === "x" &&
        (thumbPos.left < $grid.scrollLeft() || thumbPos.left > $grid.scrollLeft() + ($grid.width() - thumb.outerWidth()))
      ) {
        $list
          .parent()
          .stop()
          .animate(
            {
              scrollLeft: thumbPos.left
            },
            duration
          );
      }
    },

    update: function() {
      var that = this;
      that.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible);

      if (that.isVisible) {
        if (!that.$grid) {
          that.create();
        }

        that.instance.trigger("onThumbsShow");

        that.focus(0);
      } else if (that.$grid) {
        that.instance.trigger("onThumbsHide");
      }

      // Update content position
      that.instance.update();
    },

    hide: function() {
      this.isVisible = false;
      this.update();
    },

    show: function() {
      this.isVisible = true;
      this.update();
    },

    toggle: function() {
      this.isVisible = !this.isVisible;
      this.update();
    }
  });

  $(document).on({
    "onInit.fb": function(e, instance) {
      var Thumbs;

      if (instance && !instance.Thumbs) {
        Thumbs = new FancyThumbs(instance);

        if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
          Thumbs.show();
        }
      }
    },

    "beforeShow.fb": function(e, instance, item, firstRun) {
      var Thumbs = instance && instance.Thumbs;

      if (Thumbs && Thumbs.isVisible) {
        Thumbs.focus(firstRun ? 0 : 250);
      }
    },

    "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
      var Thumbs = instance && instance.Thumbs;

      // "G"
      if (Thumbs && Thumbs.isActive && keycode === 71) {
        keypress.preventDefault();

        Thumbs.toggle();
      }
    },

    "beforeClose.fb": function(e, instance) {
      var Thumbs = instance && instance.Thumbs;

      if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
        Thumbs.$grid.hide();
      }
    }
  });
})(document, window.jQuery || jQuery);

//// ==========================================================================
//
// Share
// Displays simple form for sharing current url
//
// ==========================================================================
(function(document, $) {
  "use strict";

  $.extend(true, $.fancybox.defaults, {
    btnTpl: {
      share:
        '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">' +
        '<svg viewBox="0 0 40 40">' +
        '<path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z">' +
        "</svg>" +
        "</button>"
    },
    share: {
      url: function(instance, item) {
        return (
          (!instance.currentHash && !(item.type === "inline" || item.type === "html") ? item.origSrc || item.src : false) || window.location
        );
      },
      tpl:
        '<div class="fancybox-share">' +
        "<h1>{{SHARE}}</h1>" +
        "<p>" +
        '<a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}">' +
        '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>' +
        "<span>Facebook</span>" +
        "</a>" +
        '<a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}">' +
        '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>' +
        "<span>Twitter</span>" +
        "</a>" +
        '<a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}">' +
        '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg>' +
        "<span>Pinterest</span>" +
        "</a>" +
        "</p>" +
        '<p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p>' +
        "</div>"
    }
  });

  function escapeHtml(string) {
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };

    return String(string).replace(/[&<>"'`=\/]/g, function(s) {
      return entityMap[s];
    });
  }

  $(document).on("click", "[data-fancybox-share]", function() {
    var instance = $.fancybox.getInstance(),
      current = instance.current || null,
      url,
      tpl;

    if (!current) {
      return;
    }

    if ($.type(current.opts.share.url) === "function") {
      url = current.opts.share.url.apply(current, [instance, current]);
    }

    tpl = current.opts.share.tpl
      .replace(/\{\{media\}\}/g, current.type === "image" ? encodeURIComponent(current.src) : "")
      .replace(/\{\{url\}\}/g, encodeURIComponent(url))
      .replace(/\{\{url_raw\}\}/g, escapeHtml(url))
      .replace(/\{\{descr\}\}/g, instance.$caption ? encodeURIComponent(instance.$caption.text()) : "");

    $.fancybox.open({
      src: instance.translate(instance, tpl),
      type: "html",
      opts: {
        animationEffect: false,
        afterLoad: function(shareInstance, shareCurrent) {
          // Close self if parent instance is closing
          instance.$refs.container.one("beforeClose.fb", function() {
            shareInstance.close(null, 0);
          });

          // Opening links in a popup window
          shareCurrent.$content.find(".fancybox-share__links a").click(function() {
            window.open(this.href, "Share", "width=550, height=450");
            return false;
          });
        }
      }
    });
  });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// Hash
// Enables linking to each modal
//
// ==========================================================================
(function(document, window, $) {
  "use strict";

  // Simple $.escapeSelector polyfill (for jQuery prior v3)
  if (!$.escapeSelector) {
    $.escapeSelector = function(sel) {
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      var fcssescape = function(ch, asCodePoint) {
        if (asCodePoint) {
          // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
          if (ch === "\0") {
            return "\uFFFD";
          }

          // Control characters and (dependent upon position) numbers get escaped as code points
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }

        // Other potentially-special ASCII characters get backslash-escaped
        return "\\" + ch;
      };

      return (sel + "").replace(rcssescape, fcssescape);
    };
  }

  // Get info about gallery name and current index from url
  function parseUrl() {
    var hash = window.location.hash.substr(1),
      rez = hash.split("-"),
      index = rez.length > 1 && /^\+?\d+$/.test(rez[rez.length - 1]) ? parseInt(rez.pop(-1), 10) || 1 : 1,
      gallery = rez.join("-");

    return {
      hash: hash,
      /* Index is starting from 1 */
      index: index < 1 ? 1 : index,
      gallery: gallery
    };
  }

  // Trigger click evnt on links to open new fancyBox instance
  function triggerFromUrl(url) {
    var $el;

    if (url.gallery !== "") {
      // If we can find element matching 'data-fancybox' atribute, then trigger click event for that.
      // It should start fancyBox
      $el = $("[data-fancybox='" + $.escapeSelector(url.gallery) + "']")
        .eq(url.index - 1)
        .trigger("click.fb-start");
    }
  }

  // Get gallery name from current instance
  function getGalleryID(instance) {
    var opts, ret;

    if (!instance) {
      return false;
    }

    opts = instance.current ? instance.current.opts : instance.opts;
    ret = opts.hash || (opts.$orig ? opts.$orig.data("fancybox") : "");

    return ret === "" ? false : ret;
  }

  // Start when DOM becomes ready
  $(function() {
    // Check if user has disabled this module
    if ($.fancybox.defaults.hash === false) {
      return;
    }

    // Update hash when opening/closing fancyBox
    $(document).on({
      "onInit.fb": function(e, instance) {
        var url, gallery;

        if (instance.group[instance.currIndex].opts.hash === false) {
          return;
        }

        url = parseUrl();
        gallery = getGalleryID(instance);

        // Make sure gallery start index matches index from hash
        if (gallery && url.gallery && gallery == url.gallery) {
          instance.currIndex = url.index - 1;
        }
      },

      "beforeShow.fb": function(e, instance, current, firstRun) {
        var gallery;

        if (!current || current.opts.hash === false) {
          return;
        }

        // Check if need to update window hash
        gallery = getGalleryID(instance);

        if (!gallery) {
          return;
        }

        // Variable containing last hash value set by fancyBox
        // It will be used to determine if fancyBox needs to close after hash change is detected
        instance.currentHash = gallery + (instance.group.length > 1 ? "-" + (current.index + 1) : "");

        // If current hash is the same (this instance most likely is opened by hashchange), then do nothing
        if (window.location.hash === "#" + instance.currentHash) {
          return;
        }

        if (!instance.origHash) {
          instance.origHash = window.location.hash;
        }

        if (instance.hashTimer) {
          clearTimeout(instance.hashTimer);
        }

        // Update hash
        instance.hashTimer = setTimeout(function() {
          if ("replaceState" in window.history) {
            window.history[firstRun ? "pushState" : "replaceState"](
              {},
              document.title,
              window.location.pathname + window.location.search + "#" + instance.currentHash
            );

            if (firstRun) {
              instance.hasCreatedHistory = true;
            }
          } else {
            window.location.hash = instance.currentHash;
          }

          instance.hashTimer = null;
        }, 300);
      },

      "beforeClose.fb": function(e, instance, current) {
        var gallery;

        if (current.opts.hash === false) {
          return;
        }

        gallery = getGalleryID(instance);

        // Goto previous history entry
        if (instance.currentHash && instance.hasCreatedHistory) {
          window.history.back();
        } else if (instance.currentHash) {
          if ("replaceState" in window.history) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (instance.origHash || ""));
          } else {
            window.location.hash = instance.origHash;
          }
        }

        instance.currentHash = null;

        clearTimeout(instance.hashTimer);
      }
    });

    // Check if need to start/close after url has changed
    $(window).on("hashchange.fb", function() {
      var url = parseUrl(),
        fb;

      // Find last fancyBox instance that has "hash"
      $.each(
        $(".fancybox-container")
          .get()
          .reverse(),
        function(index, value) {
          var tmp = $(value).data("FancyBox");
          //isClosing
          if (tmp.currentHash) {
            fb = tmp;
            return false;
          }
        }
      );

      if (fb) {
        // Now, compare hash values
        if (fb.currentHash && fb.currentHash !== url.gallery + "-" + url.index && !(url.index === 1 && fb.currentHash == url.gallery)) {
          fb.currentHash = null;

          fb.close();
        }
      } else if (url.gallery !== "") {
        triggerFromUrl(url);
      }
    });

    // Check current hash and trigger click event on matching element to start fancyBox, if needed
    setTimeout(function() {
      if (!$.fancybox.getInstance()) {
        triggerFromUrl(parseUrl());
      }
    }, 50);
  });
})(document, window, window.jQuery || jQuery);

// ==========================================================================
//
// Wheel
// Basic mouse weheel support for gallery navigation
//
// ==========================================================================
(function(document, $) {
  "use strict";

  var prevTime = new Date().getTime();

  $(document).on({
    "onInit.fb": function(e, instance, current) {
      instance.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function(e) {
        var current = instance.current,
          currTime = new Date().getTime();

        if (instance.group.length < 2 || current.opts.wheel === false || (current.opts.wheel === "auto" && current.type !== "image")) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (current.$slide.hasClass("fancybox-animated")) {
          return;
        }

        e = e.originalEvent || e;

        if (currTime - prevTime < 250) {
          return;
        }

        prevTime = currTime;

        instance[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "next" : "previous"]();
      });
    }
  });
})(document, window.jQuery || jQuery);
// Generated by CoffeeScript 1.9.3
(function() {
  var Instafeed;

  Instafeed = (function() {
    function Instafeed(params, context) {
      var option, value;
      this.options = {
        target: 'instafeed',
        get: 'popular',
        resolution: 'thumbnail',
        sortBy: 'none',
        links: true,
        mock: false,
        useHttp: false
      };
      if (typeof params === 'object') {
        for (option in params) {
          value = params[option];
          this.options[option] = value;
        }
      }
      this.context = context != null ? context : this;
      this.unique = this._genKey();
    }

    Instafeed.prototype.hasNext = function() {
      return typeof this.context.nextUrl === 'string' && this.context.nextUrl.length > 0;
    };

    Instafeed.prototype.next = function() {
      if (!this.hasNext()) {
        return false;
      }
      return this.run(this.context.nextUrl);
    };

    Instafeed.prototype.run = function(url) {
      var header, instanceName, script;
      if (typeof this.options.clientId !== 'string') {
        if (typeof this.options.accessToken !== 'string') {
          throw new Error("Missing clientId or accessToken.");
        }
      }
      if (typeof this.options.accessToken !== 'string') {
        if (typeof this.options.clientId !== 'string') {
          throw new Error("Missing clientId or accessToken.");
        }
      }
      if ((this.options.before != null) && typeof this.options.before === 'function') {
        this.options.before.call(this);
      }
      if (typeof document !== "undefined" && document !== null) {
        script = document.createElement('script');
        script.id = 'instafeed-fetcher';
        script.src = url || this._buildUrl();
        header = document.getElementsByTagName('head');
        header[0].appendChild(script);
        instanceName = "instafeedCache" + this.unique;
        window[instanceName] = new Instafeed(this.options, this);
        window[instanceName].unique = this.unique;
      }
      return true;
    };

    Instafeed.prototype.parse = function(response) {
      var anchor, childNodeCount, childNodeIndex, childNodesArr, e, eMsg, fragment, header, htmlString, httpProtocol, i, image, imageObj, imageString, imageUrl, images, img, imgHeight, imgOrient, imgUrl, imgWidth, instanceName, j, k, len, len1, len2, node, parsedLimit, reverse, sortSettings, targetEl, tmpEl;
      if (typeof response !== 'object') {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, 'Invalid JSON data');
          return false;
        } else {
          throw new Error('Invalid JSON response');
        }
      }
      if (response.meta.code !== 200) {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, response.meta.error_message);
          return false;
        } else {
          throw new Error("Error from Instagram: " + response.meta.error_message);
        }
      }
      if (response.data.length === 0) {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, 'No images were returned from Instagram');
          return false;
        } else {
          throw new Error('No images were returned from Instagram');
        }
      }
      if ((this.options.success != null) && typeof this.options.success === 'function') {
        this.options.success.call(this, response);
      }
      this.context.nextUrl = '';
      if (response.pagination != null) {
        this.context.nextUrl = response.pagination.next_url;
      }
      if (this.options.sortBy !== 'none') {
        if (this.options.sortBy === 'random') {
          sortSettings = ['', 'random'];
        } else {
          sortSettings = this.options.sortBy.split('-');
        }
        reverse = sortSettings[0] === 'least' ? true : false;
        switch (sortSettings[1]) {
          case 'random':
            response.data.sort(function() {
              return 0.5 - Math.random();
            });
            break;
          case 'recent':
            response.data = this._sortBy(response.data, 'created_time', reverse);
            break;
          case 'liked':
            response.data = this._sortBy(response.data, 'likes.count', reverse);
            break;
          case 'commented':
            response.data = this._sortBy(response.data, 'comments.count', reverse);
            break;
          default:
            throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.");
        }
      }
      if ((typeof document !== "undefined" && document !== null) && this.options.mock === false) {
        images = response.data;
        parsedLimit = parseInt(this.options.limit, 10);
        if ((this.options.limit != null) && images.length > parsedLimit) {
          images = images.slice(0, parsedLimit);
        }
        fragment = document.createDocumentFragment();
        if ((this.options.filter != null) && typeof this.options.filter === 'function') {
          images = this._filter(images, this.options.filter);
        }
        if ((this.options.template != null) && typeof this.options.template === 'string') {
          htmlString = '';
          imageString = '';
          imgUrl = '';
          tmpEl = document.createElement('div');
          for (i = 0, len = images.length; i < len; i++) {
            image = images[i];
            imageObj = image.images[this.options.resolution];
            if (typeof imageObj !== 'object') {
              eMsg = "No image found for resolution: " + this.options.resolution + ".";
              throw new Error(eMsg);
            }
            imgWidth = imageObj.width;
            imgHeight = imageObj.height;
            imgOrient = "square";
            if (imgWidth > imgHeight) {
              imgOrient = "landscape";
            }
            if (imgWidth < imgHeight) {
              imgOrient = "portrait";
            }
            imageUrl = imageObj.url;
            httpProtocol = window.location.protocol.indexOf("http") >= 0;
            if (httpProtocol && !this.options.useHttp) {
              imageUrl = imageUrl.replace(/https?:\/\//, '//');
            }
            imageString = this._makeTemplate(this.options.template, {
              model: image,
              id: image.id,
              link: image.link,
              type: image.type,
              image: imageUrl,
              width: imgWidth,
              height: imgHeight,
              orientation: imgOrient,
              caption: this._getObjectProperty(image, 'caption.text'),
              likes: image.likes.count,
              comments: image.comments.count,
              location: this._getObjectProperty(image, 'location.name')
            });
            htmlString += imageString;
          }
          tmpEl.innerHTML = htmlString;
          childNodesArr = [];
          childNodeIndex = 0;
          childNodeCount = tmpEl.childNodes.length;
          while (childNodeIndex < childNodeCount) {
            childNodesArr.push(tmpEl.childNodes[childNodeIndex]);
            childNodeIndex += 1;
          }
          for (j = 0, len1 = childNodesArr.length; j < len1; j++) {
            node = childNodesArr[j];
            fragment.appendChild(node);
          }
        } else {
          for (k = 0, len2 = images.length; k < len2; k++) {
            image = images[k];
            img = document.createElement('img');
            imageObj = image.images[this.options.resolution];
            if (typeof imageObj !== 'object') {
              eMsg = "No image found for resolution: " + this.options.resolution + ".";
              throw new Error(eMsg);
            }
            imageUrl = imageObj.url;
            httpProtocol = window.location.protocol.indexOf("http") >= 0;
            if (httpProtocol && !this.options.useHttp) {
              imageUrl = imageUrl.replace(/https?:\/\//, '//');
            }
            img.src = imageUrl;
            if (this.options.links === true) {
              anchor = document.createElement('a');
              anchor.href = image.link;
              anchor.appendChild(img);
              fragment.appendChild(anchor);
            } else {
              fragment.appendChild(img);
            }
          }
        }
        targetEl = this.options.target;
        if (typeof targetEl === 'string') {
          targetEl = document.getElementById(targetEl);
        }
        if (targetEl == null) {
          eMsg = "No element with id=\"" + this.options.target + "\" on page.";
          throw new Error(eMsg);
        }
        targetEl.appendChild(fragment);
        header = document.getElementsByTagName('head')[0];
        header.removeChild(document.getElementById('instafeed-fetcher'));
        instanceName = "instafeedCache" + this.unique;
        window[instanceName] = void 0;
        try {
          delete window[instanceName];
        } catch (_error) {
          e = _error;
        }
      }
      if ((this.options.after != null) && typeof this.options.after === 'function') {
        this.options.after.call(this);
      }
      return true;
    };

    Instafeed.prototype._buildUrl = function() {
      var base, endpoint, final;
      base = "https://api.instagram.com/v1";
      switch (this.options.get) {
        case "popular":
          endpoint = "media/popular";
          break;
        case "tagged":
          if (!this.options.tagName) {
            throw new Error("No tag name specified. Use the 'tagName' option.");
          }
          endpoint = "tags/" + this.options.tagName + "/media/recent";
          break;
        case "location":
          if (!this.options.locationId) {
            throw new Error("No location specified. Use the 'locationId' option.");
          }
          endpoint = "locations/" + this.options.locationId + "/media/recent";
          break;
        case "user":
          if (!this.options.userId) {
            throw new Error("No user specified. Use the 'userId' option.");
          }
          endpoint = "users/" + this.options.userId + "/media/recent";
          break;
        default:
          throw new Error("Invalid option for get: '" + this.options.get + "'.");
      }
      final = base + "/" + endpoint;
      if (this.options.accessToken != null) {
        final += "?access_token=" + this.options.accessToken;
      } else {
        final += "?client_id=" + this.options.clientId;
      }
      if (this.options.limit != null) {
        final += "&count=" + this.options.limit;
      }
      final += "&callback=instafeedCache" + this.unique + ".parse";
      return final;
    };

    Instafeed.prototype._genKey = function() {
      var S4;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return "" + (S4()) + (S4()) + (S4()) + (S4());
    };

    Instafeed.prototype._makeTemplate = function(template, data) {
      var output, pattern, ref, varName, varValue;
      pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
      output = template;
      while (pattern.test(output)) {
        varName = output.match(pattern)[1];
        varValue = (ref = this._getObjectProperty(data, varName)) != null ? ref : '';
        output = output.replace(pattern, function() {
          return "" + varValue;
        });
      }
      return output;
    };

    Instafeed.prototype._getObjectProperty = function(object, property) {
      var piece, pieces;
      property = property.replace(/\[(\w+)\]/g, '.$1');
      pieces = property.split('.');
      while (pieces.length) {
        piece = pieces.shift();
        if ((object != null) && piece in object) {
          object = object[piece];
        } else {
          return null;
        }
      }
      return object;
    };

    Instafeed.prototype._sortBy = function(data, property, reverse) {
      var sorter;
      sorter = function(a, b) {
        var valueA, valueB;
        valueA = this._getObjectProperty(a, property);
        valueB = this._getObjectProperty(b, property);
        if (reverse) {
          if (valueA > valueB) {
            return 1;
          } else {
            return -1;
          }
        }
        if (valueA < valueB) {
          return 1;
        } else {
          return -1;
        }
      };
      data.sort(sorter.bind(this));
      return data;
    };

    Instafeed.prototype._filter = function(images, filter) {
      var filteredImages, fn, i, image, len;
      filteredImages = [];
      fn = function(image) {
        if (filter(image)) {
          return filteredImages.push(image);
        }
      };
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        fn(image);
      }
      return filteredImages;
    };

    return Instafeed;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      return module.exports = factory();
    } else {
      return root.Instafeed = factory();
    }
  })(this, function() {
    return Instafeed;
  });

}).call(this);
/*
 * International Telephone Input v14.0.2
 * https://github.com/jackocnr/intl-tel-input.git
 * Licensed under the MIT license
 */

!function(a){"object"==typeof module&&module.exports?module.exports=a(require("jquery"),window,document):"function"==typeof define&&define.amd?define(["jquery"],function(b){a(b,window,document)}):a(jQuery,window,document)}(function(a,b,c,d){"use strict";function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}function g(a,b,c){return b&&f(a.prototype,b),c&&f(a,c),a}for(var h=[["Afghanistan (‫افغانستان‬‎)","af","93"],["Albania (Shqipëri)","al","355"],["Algeria (‫الجزائر‬‎)","dz","213"],["American Samoa","as","1684"],["Andorra","ad","376"],["Angola","ao","244"],["Anguilla","ai","1264"],["Antigua and Barbuda","ag","1268"],["Argentina","ar","54"],["Armenia (Հայաստան)","am","374"],["Aruba","aw","297"],["Australia","au","61",0],["Austria (Österreich)","at","43"],["Azerbaijan (Azərbaycan)","az","994"],["Bahamas","bs","1242"],["Bahrain (‫البحرين‬‎)","bh","973"],["Bangladesh (বাংলাদেশ)","bd","880"],["Barbados","bb","1246"],["Belarus (Беларусь)","by","375"],["Belgium (België)","be","32"],["Belize","bz","501"],["Benin (Bénin)","bj","229"],["Bermuda","bm","1441"],["Bhutan (འབྲུག)","bt","975"],["Bolivia","bo","591"],["Bosnia and Herzegovina (Босна и Херцеговина)","ba","387"],["Botswana","bw","267"],["Brazil (Brasil)","br","55"],["British Indian Ocean Territory","io","246"],["British Virgin Islands","vg","1284"],["Brunei","bn","673"],["Bulgaria (България)","bg","359"],["Burkina Faso","bf","226"],["Burundi (Uburundi)","bi","257"],["Cambodia (កម្ពុជា)","kh","855"],["Cameroon (Cameroun)","cm","237"],["Canada","ca","1",1,["204","226","236","249","250","289","306","343","365","387","403","416","418","431","437","438","450","506","514","519","548","579","581","587","604","613","639","647","672","705","709","742","778","780","782","807","819","825","867","873","902","905"]],["Cape Verde (Kabu Verdi)","cv","238"],["Caribbean Netherlands","bq","599",1],["Cayman Islands","ky","1345"],["Central African Republic (République centrafricaine)","cf","236"],["Chad (Tchad)","td","235"],["Chile","cl","56"],["China (中国)","cn","86"],["Christmas Island","cx","61",2],["Cocos (Keeling) Islands","cc","61",1],["Colombia","co","57"],["Comoros (‫جزر القمر‬‎)","km","269"],["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)","cd","243"],["Congo (Republic) (Congo-Brazzaville)","cg","242"],["Cook Islands","ck","682"],["Costa Rica","cr","506"],["Côte d’Ivoire","ci","225"],["Croatia (Hrvatska)","hr","385"],["Cuba","cu","53"],["Curaçao","cw","599",0],["Cyprus (Κύπρος)","cy","357"],["Czech Republic (Česká republika)","cz","420"],["Denmark (Danmark)","dk","45"],["Djibouti","dj","253"],["Dominica","dm","1767"],["Dominican Republic (República Dominicana)","do","1",2,["809","829","849"]],["Ecuador","ec","593"],["Egypt (‫مصر‬‎)","eg","20"],["El Salvador","sv","503"],["Equatorial Guinea (Guinea Ecuatorial)","gq","240"],["Eritrea","er","291"],["Estonia (Eesti)","ee","372"],["Ethiopia","et","251"],["Falkland Islands (Islas Malvinas)","fk","500"],["Faroe Islands (Føroyar)","fo","298"],["Fiji","fj","679"],["Finland (Suomi)","fi","358",0],["France","fr","33"],["French Guiana (Guyane française)","gf","594"],["French Polynesia (Polynésie française)","pf","689"],["Gabon","ga","241"],["Gambia","gm","220"],["Georgia (საქართველო)","ge","995"],["Germany (Deutschland)","de","49"],["Ghana (Gaana)","gh","233"],["Gibraltar","gi","350"],["Greece (Ελλάδα)","gr","30"],["Greenland (Kalaallit Nunaat)","gl","299"],["Grenada","gd","1473"],["Guadeloupe","gp","590",0],["Guam","gu","1671"],["Guatemala","gt","502"],["Guernsey","gg","44",1],["Guinea (Guinée)","gn","224"],["Guinea-Bissau (Guiné Bissau)","gw","245"],["Guyana","gy","592"],["Haiti","ht","509"],["Honduras","hn","504"],["Hong Kong (香港)","hk","852"],["Hungary (Magyarország)","hu","36"],["Iceland (Ísland)","is","354"],["India (भारत)","in","91"],["Indonesia","id","62"],["Iran (‫ایران‬‎)","ir","98"],["Iraq (‫العراق‬‎)","iq","964"],["Ireland","ie","353"],["Isle of Man","im","44",2],["Israel (‫ישראל‬‎)","il","972"],["Italy (Italia)","it","39",0],["Jamaica","jm","1",4,["876","658"]],["Japan (日本)","jp","81"],["Jersey","je","44",3],["Jordan (‫الأردن‬‎)","jo","962"],["Kazakhstan (Казахстан)","kz","7",1],["Kenya","ke","254"],["Kiribati","ki","686"],["Kosovo","xk","383"],["Kuwait (‫الكويت‬‎)","kw","965"],["Kyrgyzstan (Кыргызстан)","kg","996"],["Laos (ລາວ)","la","856"],["Latvia (Latvija)","lv","371"],["Lebanon (‫لبنان‬‎)","lb","961"],["Lesotho","ls","266"],["Liberia","lr","231"],["Libya (‫ليبيا‬‎)","ly","218"],["Liechtenstein","li","423"],["Lithuania (Lietuva)","lt","370"],["Luxembourg","lu","352"],["Macau (澳門)","mo","853"],["Macedonia (FYROM) (Македонија)","mk","389"],["Madagascar (Madagasikara)","mg","261"],["Malawi","mw","265"],["Malaysia","my","60"],["Maldives","mv","960"],["Mali","ml","223"],["Malta","mt","356"],["Marshall Islands","mh","692"],["Martinique","mq","596"],["Mauritania (‫موريتانيا‬‎)","mr","222"],["Mauritius (Moris)","mu","230"],["Mayotte","yt","262",1],["Mexico (México)","mx","52"],["Micronesia","fm","691"],["Moldova (Republica Moldova)","md","373"],["Monaco","mc","377"],["Mongolia (Монгол)","mn","976"],["Montenegro (Crna Gora)","me","382"],["Montserrat","ms","1664"],["Morocco (‫المغرب‬‎)","ma","212",0],["Mozambique (Moçambique)","mz","258"],["Myanmar (Burma) (မြန်မာ)","mm","95"],["Namibia (Namibië)","na","264"],["Nauru","nr","674"],["Nepal (नेपाल)","np","977"],["Netherlands (Nederland)","nl","31"],["New Caledonia (Nouvelle-Calédonie)","nc","687"],["New Zealand","nz","64"],["Nicaragua","ni","505"],["Niger (Nijar)","ne","227"],["Nigeria","ng","234"],["Niue","nu","683"],["Norfolk Island","nf","672"],["North Korea (조선 민주주의 인민 공화국)","kp","850"],["Northern Mariana Islands","mp","1670"],["Norway (Norge)","no","47",0],["Oman (‫عُمان‬‎)","om","968"],["Pakistan (‫پاکستان‬‎)","pk","92"],["Palau","pw","680"],["Palestine (‫فلسطين‬‎)","ps","970"],["Panama (Panamá)","pa","507"],["Papua New Guinea","pg","675"],["Paraguay","py","595"],["Peru (Perú)","pe","51"],["Philippines","ph","63"],["Poland (Polska)","pl","48"],["Portugal","pt","351"],["Puerto Rico","pr","1",3,["787","939"]],["Qatar (‫قطر‬‎)","qa","974"],["Réunion (La Réunion)","re","262",0],["Romania (România)","ro","40"],["Russia (Россия)","ru","7",0],["Rwanda","rw","250"],["Saint Barthélemy","bl","590",1],["Saint Helena","sh","290"],["Saint Kitts and Nevis","kn","1869"],["Saint Lucia","lc","1758"],["Saint Martin (Saint-Martin (partie française))","mf","590",2],["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)","pm","508"],["Saint Vincent and the Grenadines","vc","1784"],["Samoa","ws","685"],["San Marino","sm","378"],["São Tomé and Príncipe (São Tomé e Príncipe)","st","239"],["Saudi Arabia (‫المملكة العربية السعودية‬‎)","sa","966"],["Senegal (Sénégal)","sn","221"],["Serbia (Србија)","rs","381"],["Seychelles","sc","248"],["Sierra Leone","sl","232"],["Singapore","sg","65"],["Sint Maarten","sx","1721"],["Slovakia (Slovensko)","sk","421"],["Slovenia (Slovenija)","si","386"],["Solomon Islands","sb","677"],["Somalia (Soomaaliya)","so","252"],["South Africa","za","27"],["South Korea (대한민국)","kr","82"],["South Sudan (‫جنوب السودان‬‎)","ss","211"],["Spain (España)","es","34"],["Sri Lanka (ශ්‍රී ලංකාව)","lk","94"],["Sudan (‫السودان‬‎)","sd","249"],["Suriname","sr","597"],["Svalbard and Jan Mayen","sj","47",1],["Swaziland","sz","268"],["Sweden (Sverige)","se","46"],["Switzerland (Schweiz)","ch","41"],["Syria (‫سوريا‬‎)","sy","963"],["Taiwan (台灣)","tw","886"],["Tajikistan","tj","992"],["Tanzania","tz","255"],["Thailand (ไทย)","th","66"],["Timor-Leste","tl","670"],["Togo","tg","228"],["Tokelau","tk","690"],["Tonga","to","676"],["Trinidad and Tobago","tt","1868"],["Tunisia (‫تونس‬‎)","tn","216"],["Turkey (Türkiye)","tr","90"],["Turkmenistan","tm","993"],["Turks and Caicos Islands","tc","1649"],["Tuvalu","tv","688"],["U.S. Virgin Islands","vi","1340"],["Uganda","ug","256"],["Ukraine (Україна)","ua","380"],["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)","ae","971"],["United Kingdom","gb","44",0],["United States","us","1",0],["Uruguay","uy","598"],["Uzbekistan (Oʻzbekiston)","uz","998"],["Vanuatu","vu","678"],["Vatican City (Città del Vaticano)","va","39",1],["Venezuela","ve","58"],["Vietnam (Việt Nam)","vn","84"],["Wallis and Futuna (Wallis-et-Futuna)","wf","681"],["Western Sahara (‫الصحراء الغربية‬‎)","eh","212",1],["Yemen (‫اليمن‬‎)","ye","967"],["Zambia","zm","260"],["Zimbabwe","zw","263"],["Åland Islands","ax","358",1]],i=0;i<h.length;i++){var j=h[i];h[i]={name:j[0],iso2:j[1],dialCode:j[2],priority:j[3]||0,areaCodes:j[4]||null}}b.intlTelInputGlobals={instances:{}};var k=0,l={allowDropdown:!0,autoHideDialCode:!0,autoPlaceholder:"polite",customPlaceholder:null,dropdownContainer:null,excludeCountries:[],formatOnDisplay:!0,geoIpLookup:null,hiddenInput:"",initialCountry:"",localizedCountries:null,nationalMode:!0,onlyCountries:[],placeholderNumberType:"MOBILE",preferredCountries:["us","gb"],separateDialCode:!1,utilsScript:""},m=["800","822","833","844","855","866","877","880","881","882","883","884","885","886","887","888","889"];b.addEventListener("load",function(){b.intlTelInputGlobals.windowLoaded=!0});var n=function(a,b){for(var c=Object.keys(a),d=0;d<c.length;d++)b(c[d],a[c[d]])},o=function(a){n(b.intlTelInputGlobals.instances,function(c){b.intlTelInputGlobals.instances[c][a]()})},p=function(){function a(b,c){var d=this;e(this,a),this.id=k++,this.a=b,this.activeItem=null,this.highlightedItem=null;var f=c||{};this.b={},n(l,function(a,b){d.b[a]=f.hasOwnProperty(a)?f[a]:b}),this.e=Boolean(b.getAttribute("placeholder"))}return g(a,[{key:"_init",value:function(){var a=this;if(this.b.nationalMode&&(this.b.autoHideDialCode=!1),this.b.separateDialCode&&(this.b.autoHideDialCode=this.b.nationalMode=!1),this.g=/Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.g&&(c.body.classList.add("iti-mobile"),this.b.dropdownContainer||(this.b.dropdownContainer=c.body)),"undefined"!=typeof Promise){var b=new Promise(function(b,c){a.h=b,a.rejectAutoCountryPromise=c}),d=new Promise(function(b,c){a.i=b,a.rejectUtilsScriptPromise=c});this.promise=Promise.all([b,d])}else this.h=this.rejectAutoCountryPromise=function(){},this.i=this.rejectUtilsScriptPromise=function(){};this.s={},this._b(),this._f(),this._h(),this._i(),this._i2()}},{key:"_b",value:function(){this._d(),this._d2(),this._e(),this.b.localizedCountries&&this._translateCountriesByLocale(),(this.b.onlyCountries.length||this.b.localizedCountries)&&this.p.sort(this._countryNameSort)}},{key:"_c",value:function(a,b,c){this.q.hasOwnProperty(b)||(this.q[b]=[]);var d=c||0;this.q[b][d]=a}},{key:"_d",value:function(){if(this.b.onlyCountries.length){var a=this.b.onlyCountries.map(function(a){return a.toLowerCase()});this.p=h.filter(function(b){return a.indexOf(b.iso2)>-1})}else if(this.b.excludeCountries.length){var b=this.b.excludeCountries.map(function(a){return a.toLowerCase()});this.p=h.filter(function(a){return-1===b.indexOf(a.iso2)})}else this.p=h}},{key:"_translateCountriesByLocale",value:function(){for(var a=0;a<this.p.length;a++){var b=this.p[a].iso2.toLowerCase();this.b.localizedCountries.hasOwnProperty(b)&&(this.p[a].name=this.b.localizedCountries[b])}}},{key:"_countryNameSort",value:function(a,b){return a.name.localeCompare(b.name)}},{key:"_d2",value:function(){this.q={};for(var a=0;a<this.p.length;a++){var b=this.p[a];if(this._c(b.iso2,b.dialCode,b.priority),b.areaCodes)for(var c=0;c<b.areaCodes.length;c++)this._c(b.iso2,b.dialCode+b.areaCodes[c])}}},{key:"_e",value:function(){this.preferredCountries=[];for(var a=0;a<this.b.preferredCountries.length;a++){var b=this.b.preferredCountries[a].toLowerCase(),c=this._y(b,!1,!0);c&&this.preferredCountries.push(c)}}},{key:"_createEl",value:function(a,b,d){var e=c.createElement(a);return b&&n(b,function(a,b){return e.setAttribute(a,b)}),d&&d.appendChild(e),e}},{key:"_f",value:function(){this.a.setAttribute("autocomplete","off");var a="intl-tel-input";this.b.allowDropdown&&(a+=" allow-dropdown"),this.b.separateDialCode&&(a+=" separate-dial-code");var b=this._createEl("div",{"class":a});if(this.a.parentNode.insertBefore(b,this.a),this.k=this._createEl("div",{"class":"flag-container"},b),b.appendChild(this.a),this.selectedFlag=this._createEl("div",{"class":"selected-flag",role:"combobox","aria-owns":"country-listbox"},this.k),this.l=this._createEl("div",{"class":"iti-flag"},this.selectedFlag),this.b.separateDialCode&&(this.t=this._createEl("div",{"class":"selected-dial-code"},this.selectedFlag)),this.b.allowDropdown&&(this.selectedFlag.setAttribute("tabindex","0"),this.dropdownArrow=this._createEl("div",{"class":"iti-arrow"},this.selectedFlag),this.m=this._createEl("ul",{"class":"country-list hide",id:"country-listbox","aria-expanded":"false",role:"listbox"}),this.preferredCountries.length&&(this._g(this.preferredCountries,"preferred"),this._createEl("li",{"class":"divider",role:"separator","aria-disabled":"true"},this.m)),this._g(this.p,"standard"),this.b.dropdownContainer?(this.dropdown=this._createEl("div",{"class":"intl-tel-input iti-container"}),this.dropdown.appendChild(this.m)):this.k.appendChild(this.m)),this.b.hiddenInput){var c=this.b.hiddenInput,d=this.a.getAttribute("name");if(d){var e=d.lastIndexOf("[");-1!==e&&(c="".concat(d.substr(0,e),"[").concat(c,"]"))}this.hiddenInput=this._createEl("input",{type:"hidden",name:c}),b.appendChild(this.hiddenInput)}}},{key:"_g",value:function(a,b){for(var c="",d=0;d<a.length;d++){var e=a[d];c+="<li class='country ".concat(b,"' id='iti-item-").concat(e.iso2,"' role='option' data-dial-code='").concat(e.dialCode,"' data-country-code='").concat(e.iso2,"'>"),c+="<div class='flag-box'><div class='iti-flag ".concat(e.iso2,"'></div></div>"),c+="<span class='country-name'>".concat(e.name,"</span>"),c+="<span class='dial-code'>+".concat(e.dialCode,"</span>"),c+="</li>"}this.m.insertAdjacentHTML("beforeend",c)}},{key:"_h",value:function(){var a=this.a.value,b=this._af(a),c=this._isRegionlessNanp(a),d=this.b,e=d.initialCountry,f=d.nationalMode,g=d.autoHideDialCode,h=d.separateDialCode;b&&!c?this._v(a):"auto"!==e&&(e?this._z(e.toLowerCase()):b&&c?this._z("us"):(this.j=this.preferredCountries.length?this.preferredCountries[0].iso2:this.p[0].iso2,a||this._z(this.j)),a||f||g||h||(this.a.value="+".concat(this.s.dialCode))),a&&this._u(a)}},{key:"_i",value:function(){this._j(),this.b.autoHideDialCode&&this._l(),this.b.allowDropdown&&this._i1(),this.hiddenInput&&this._initHiddenInputListener()}},{key:"_initHiddenInputListener",value:function(){var a=this;this._handleHiddenInputSubmit=function(){a.hiddenInput.value=a.getNumber()},this.a.form&&this.a.form.addEventListener("submit",this._handleHiddenInputSubmit)}},{key:"_getClosestLabel",value:function(){for(var a=this.a;a&&"LABEL"!==a.tagName;)a=a.parentNode;return a}},{key:"_i1",value:function(){var a=this;this._handleLabelClick=function(b){a.m.classList.contains("hide")?a.a.focus():b.preventDefault()};var b=this._getClosestLabel();b&&b.addEventListener("click",this._handleLabelClick),this._handleClickSelectedFlag=function(){!a.m.classList.contains("hide")||a.a.disabled||a.a.readOnly||a._n()},this.selectedFlag.addEventListener("click",this._handleClickSelectedFlag),this._handleFlagsContainerKeydown=function(b){a.m.classList.contains("hide")&&-1!==["ArrowUp","ArrowDown"," ","Enter"].indexOf(b.key)&&(b.preventDefault(),b.stopPropagation(),a._n()),"Tab"===b.key&&a._ac()},this.k.addEventListener("keydown",this._handleFlagsContainerKeydown)}},{key:"_i2",value:function(){var a=this;this.b.utilsScript&&!b.intlTelInputUtils?b.intlTelInputGlobals.windowLoaded?b.intlTelInputGlobals.loadUtils(this.b.utilsScript):b.addEventListener("load",function(){b.intlTelInputGlobals.loadUtils(a.b.utilsScript)}):this.i(),"auto"===this.b.initialCountry?this._i3():this.h()}},{key:"_i3",value:function(){b.intlTelInputGlobals.autoCountry?this.handleAutoCountry():b.intlTelInputGlobals.startedLoadingAutoCountry||(b.intlTelInputGlobals.startedLoadingAutoCountry=!0,"function"==typeof this.b.geoIpLookup&&this.b.geoIpLookup(function(a){b.intlTelInputGlobals.autoCountry=a.toLowerCase(),setTimeout(function(){return o("handleAutoCountry")})},function(){return o("rejectAutoCountryPromise")}))}},{key:"_j",value:function(){var a=this;this._handleKeyupEvent=function(){a._v(a.a.value)&&a._triggerCountryChange()},this.a.addEventListener("keyup",this._handleKeyupEvent),this._handleClipboardEvent=function(){setTimeout(a._handleKeyupEvent)},this.a.addEventListener("cut",this._handleClipboardEvent),this.a.addEventListener("paste",this._handleClipboardEvent)}},{key:"_j2",value:function(a){var b=this.a.getAttribute("maxlength");return b&&a.length>b?a.substr(0,b):a}},{key:"_l",value:function(){var a=this;this._handleMousedownFocusEvent=function(b){a.a===c.activeElement||a.a.value||(b.preventDefault(),a.a.focus())},this.a.addEventListener("mousedown",this._handleMousedownFocusEvent),this._handleKeypressPlusEvent=function(b){"+"===b.key&&(a.a.value="")},this._handleFocusEvent=function(){a.a.value||a.a.readOnly||!a.s.dialCode||(a.a.value="+".concat(a.s.dialCode),a.a.addEventListener("keypress",a._handleKeypressPlusEvent),setTimeout(function(){var b=a.a.value.length;a.a.setSelectionRange(b,b)}))},this.a.addEventListener("focus",this._handleFocusEvent),this._handleSubmitOrBlurEvent=function(){a._removeEmptyDialCode()},this.a.form&&this.a.form.addEventListener("submit",this._handleSubmitOrBlurEvent),this.a.addEventListener("blur",this._handleSubmitOrBlurEvent)}},{key:"_removeEmptyDialCode",value:function(){if("+"===this.a.value.charAt(0)){var a=this._m(this.a.value);a&&this.s.dialCode!==a||(this.a.value="")}this.a.removeEventListener("keypress",this._handleKeypressPlusEvent)}},{key:"_m",value:function(a){return a.replace(/\D/g,"")}},{key:"_trigger",value:function(a){var b=c.createEvent("Event");b.initEvent(a,!0,!0),this.a.dispatchEvent(b)}},{key:"_n",value:function(){this.m.classList.remove("hide"),this.m.setAttribute("aria-expanded","true"),this._o(),this.activeItem&&(this._x(this.activeItem),this._ad(this.activeItem)),this._p(),this.dropdownArrow.classList.add("up"),this._trigger("open:countrydropdown")}},{key:"_toggleClass",value:function(a,b,c){c&&!a.classList.contains(b)?a.classList.add(b):!c&&a.classList.contains(b)&&a.classList.remove(b)}},{key:"_o",value:function(){var a=this;if(this.b.dropdownContainer&&this.b.dropdownContainer.appendChild(this.dropdown),!this.g){var d=this.a.getBoundingClientRect(),e=b.pageYOffset||c.documentElement.scrollTop,f=d.top+e,g=this.m.offsetHeight,h=f+this.a.offsetHeight+g<e+b.innerHeight,i=f-g>e;if(this._toggleClass(this.m,"dropup",!h&&i),this.b.dropdownContainer){var j=!h&&i?0:this.a.offsetHeight;this.dropdown.style.top="".concat(f+j,"px"),this.dropdown.style.left="".concat(d.left+c.body.scrollLeft,"px"),this._handleWindowScroll=function(){return a._ac()},b.addEventListener("scroll",this._handleWindowScroll)}}}},{key:"_getClosestListItem",value:function(a){for(var b=a;b&&b!==this.m&&!b.classList.contains("country");)b=b.parentNode;return b===this.m?null:b}},{key:"_p",value:function(){var a=this;this._handleMouseoverCountryList=function(b){var c=a._getClosestListItem(b.target);c&&a._x(c)},this.m.addEventListener("mouseover",this._handleMouseoverCountryList),this._handleClickCountryList=function(b){var c=a._getClosestListItem(b.target);c&&a._ab(c)},this.m.addEventListener("click",this._handleClickCountryList);var b=!0;this._handleClickOffToClose=function(){b||a._ac(),b=!1},c.documentElement.addEventListener("click",this._handleClickOffToClose);var d="",e=null;this._handleKeydownOnDropdown=function(b){b.preventDefault(),"ArrowUp"===b.key||"ArrowDown"===b.key?a._q(b.key):"Enter"===b.key?a._r():"Escape"===b.key?a._ac():/^[a-zA-ZÀ-ÿ ]$/.test(b.key)&&(e&&clearTimeout(e),d+=b.key.toLowerCase(),a._s(d),e=setTimeout(function(){d=""},1e3))},c.addEventListener("keydown",this._handleKeydownOnDropdown)}},{key:"_q",value:function(a){var b="ArrowUp"===a?this.highlightedItem.previousElementSibling:this.highlightedItem.nextElementSibling;b&&(b.classList.contains("divider")&&(b="ArrowUp"===a?b.previousElementSibling:b.nextElementSibling),this._x(b),this._ad(b))}},{key:"_r",value:function(){this.highlightedItem&&this._ab(this.highlightedItem)}},{key:"_s",value:function(a){for(var b=0;b<this.p.length;b++)if(this._t(this.p[b].name,a)){var c=this.m.querySelector("#iti-item-".concat(this.p[b].iso2));this._x(c),this._ad(c,!0);break}}},{key:"_t",value:function(a,b){return a.substr(0,b.length).toLowerCase()===b}},{key:"_u",value:function(a){var c=a;if(this.b.formatOnDisplay&&b.intlTelInputUtils&&this.s){var d=!this.b.separateDialCode&&(this.b.nationalMode||"+"!==c.charAt(0)),e=intlTelInputUtils.numberFormat,f=e.NATIONAL,g=e.INTERNATIONAL,h=d?f:g;c=intlTelInputUtils.formatNumber(c,this.s.iso2,h)}c=this._ah(c),this.a.value=c}},{key:"_v",value:function(a){var b=a,c="1"===this.s.dialCode;b&&this.b.nationalMode&&c&&"+"!==b.charAt(0)&&("1"!==b.charAt(0)&&(b="1".concat(b)),b="+".concat(b));var d=this._af(b),e=this._m(b),f=null;if(d){var g=this.q[this._m(d)],h=-1!==g.indexOf(this.s.iso2),i="+1"===d&&e.length>=4;if(!("1"===this.s.dialCode&&this._isRegionlessNanp(e))&&(!h||i))for(var j=0;j<g.length;j++)if(g[j]){f=g[j];break}}else"+"===b.charAt(0)&&e.length?f="":b&&"+"!==b||(f=this.j);return null!==f&&this._z(f)}},{key:"_isRegionlessNanp",value:function(a){var b=this._m(a);if("1"===b.charAt(0)){var c=b.substr(1,3);return-1!==m.indexOf(c)}return!1}},{key:"_x",value:function(a){var b=this.highlightedItem;b&&b.classList.remove("highlight"),this.highlightedItem=a,this.highlightedItem.classList.add("highlight")}},{key:"_y",value:function(a,b,c){for(var d=b?h:this.p,e=0;e<d.length;e++)if(d[e].iso2===a)return d[e];if(c)return null;throw new Error("No country data for '".concat(a,"'"))}},{key:"_z",value:function(a){var b=this.s.iso2?this.s:{};this.s=a?this._y(a,!1,!1):{},this.s.iso2&&(this.j=this.s.iso2),this.l.setAttribute("class","iti-flag ".concat(a));var c=a?"".concat(this.s.name,": +").concat(this.s.dialCode):"Unknown";if(this.selectedFlag.setAttribute("title",c),this.b.separateDialCode){var d=this.s.dialCode?"+".concat(this.s.dialCode):"",e=this.a.parentNode;b.dialCode&&e.classList.remove("iti-sdc-".concat(b.dialCode.length+1)),d&&e.classList.add("iti-sdc-".concat(d.length)),this.t.innerHTML=d}if(this._aa(),this.b.allowDropdown){var f=this.activeItem;if(f&&(f.classList.remove("active"),f.setAttribute("aria-selected","false")),a){var g=this.m.querySelector("#iti-item-".concat(a));g.setAttribute("aria-selected","true"),g.classList.add("active"),this.activeItem=g,this.m.setAttribute("aria-activedescendant",g.getAttribute("id"))}}return b.iso2!==a}},{key:"_aa",value:function(){var a="aggressive"===this.b.autoPlaceholder||!this.e&&"polite"===this.b.autoPlaceholder;if(b.intlTelInputUtils&&a){var c=intlTelInputUtils.numberType[this.b.placeholderNumberType],d=this.s.iso2?intlTelInputUtils.getExampleNumber(this.s.iso2,this.b.nationalMode,c):"";d=this._ah(d),"function"==typeof this.b.customPlaceholder&&(d=this.b.customPlaceholder(d,this.s)),this.a.setAttribute("placeholder",d)}}},{key:"_ab",value:function(a){var b=this._z(a.getAttribute("data-country-code"));this._ac(),this._ae(a.getAttribute("data-dial-code"),!0),this.a.focus();var c=this.a.value.length;this.a.setSelectionRange(c,c),b&&this._triggerCountryChange()}},{key:"_ac",value:function(){this.m.classList.add("hide"),this.m.setAttribute("aria-expanded","false"),this.dropdownArrow.classList.remove("up"),c.removeEventListener("keydown",this._handleKeydownOnDropdown),c.documentElement.removeEventListener("click",this._handleClickOffToClose),this.m.removeEventListener("mouseover",this._handleMouseoverCountryList),this.m.removeEventListener("click",this._handleClickCountryList),this.b.dropdownContainer&&(this.g||b.removeEventListener("scroll",this._handleWindowScroll),this.dropdown.parentNode&&this.dropdown.parentNode.removeChild(this.dropdown)),this._trigger("close:countrydropdown")}},{key:"_ad",value:function(a,d){var e=this.m,f=b.pageYOffset||c.documentElement.scrollTop,g=e.offsetHeight,h=e.getBoundingClientRect().top+f,i=h+g,j=a.offsetHeight,k=a.getBoundingClientRect().top+f,l=k+j,m=k-h+e.scrollTop,n=g/2-j/2;if(k<h)d&&(m-=n),e.scrollTop=m;else if(l>i){d&&(m+=n);var o=g-j;e.scrollTop=m-o}}},{key:"_ae",value:function(a,b){var c,d=this.a.value,e="+".concat(a);if("+"===d.charAt(0)){var f=this._af(d);c=f?d.replace(f,e):e}else{if(this.b.nationalMode||this.b.separateDialCode)return;if(d)c=e+d;else{if(!b&&this.b.autoHideDialCode)return;c=e}}this.a.value=c}},{key:"_af",value:function(a){var b="";if("+"===a.charAt(0))for(var c="",d=0;d<a.length;d++){var e=a.charAt(d);if(!isNaN(parseInt(e,10))&&(c+=e,this.q[c]&&(b=a.substr(0,d+1)),4===c.length))break}return b}},{key:"_ag",value:function(){var a=this.a.value.trim(),b=this.s.dialCode,c=this._m(a),d="1"===c.charAt(0)?c:"1".concat(c);return(this.b.separateDialCode?"+".concat(b):a&&"+"!==a.charAt(0)&&"1"!==a.charAt(0)&&b&&"1"===b.charAt(0)&&4===b.length&&b!==d.substr(0,4)?b.substr(1):"")+a}},{key:"_ah",value:function(a){var b=a;if(this.b.separateDialCode){var c=this._af(b);if(c){null!==this.s.areaCodes&&(c="+".concat(this.s.dialCode));var d=" "===b[c.length]||"-"===b[c.length]?c.length+1:c.length;b=b.substr(d)}}return this._j2(b)}},{key:"_triggerCountryChange",value:function(){this._trigger("countrychange")}},{key:"handleAutoCountry",value:function(){"auto"===this.b.initialCountry&&(this.j=b.intlTelInputGlobals.autoCountry,this.a.value||this.setCountry(this.j),this.h())}},{key:"handleUtils",value:function(){b.intlTelInputUtils&&(this.a.value&&this._u(this.a.value),this._aa()),this.i()}},{key:"destroy",value:function(){var a=this.a.form;if(this.b.allowDropdown){this._ac(),this.selectedFlag.removeEventListener("click",this._handleClickSelectedFlag),this.k.removeEventListener("keydown",this._handleFlagsContainerKeydown);var c=this._getClosestLabel();c&&c.removeEventListener("click",this._handleLabelClick)}this.hiddenInput&&a&&a.removeEventListener("submit",this._handleHiddenInputSubmit),this.b.autoHideDialCode&&(this.a.removeEventListener("mousedown",this._handleMousedownFocusEvent),this.a.removeEventListener("focus",this._handleFocusEvent),a&&a.removeEventListener("submit",this._handleSubmitOrBlurEvent),this.a.removeEventListener("blur",this._handleSubmitOrBlurEvent)),this.a.removeEventListener("keyup",this._handleKeyupEvent),this.a.removeEventListener("cut",this._handleClipboardEvent),this.a.removeEventListener("paste",this._handleClipboardEvent);var d=this.a.parentNode;d.parentNode.insertBefore(this.a,d),d.parentNode.removeChild(d),delete b.intlTelInputGlobals.instances[this.id]}},{key:"getExtension",value:function(){return b.intlTelInputUtils?intlTelInputUtils.getExtension(this._ag(),this.s.iso2):""}},{key:"getNumber",value:function(a){if(b.intlTelInputUtils){var c=this.s.iso2;return intlTelInputUtils.formatNumber(this._ag(),c,a)}return""}},{key:"getNumberType",value:function(){return b.intlTelInputUtils?intlTelInputUtils.getNumberType(this._ag(),this.s.iso2):-99}},{key:"getSelectedCountryData",value:function(){return this.s}},{key:"getValidationError",value:function(){if(b.intlTelInputUtils){var a=this.s.iso2;return intlTelInputUtils.getValidationError(this._ag(),a)}return-99}},{key:"isValidNumber",value:function(){var a=this._ag().trim(),c=this.b.nationalMode?this.s.iso2:"";return b.intlTelInputUtils?intlTelInputUtils.isValidNumber(a,c):null}},{key:"setCountry",value:function(a){var b=a.toLowerCase();this.l.classList.contains(b)||(this._z(b),this._ae(this.s.dialCode,!1),this._triggerCountryChange())}},{key:"setNumber",value:function(a){var b=this._v(a);this._u(a),b&&this._triggerCountryChange()}},{key:"setPlaceholderNumberType",value:function(a){this.b.placeholderNumberType=a,this._aa()}}]),a}();b.intlTelInputGlobals.getCountryData=function(){return h};var q=function(a,b,d){var e=c.createElement("script");e.onload=function(){o("handleUtils"),b&&b()},e.onerror=function(){o("rejectUtilsScriptPromise"),d&&d()},e.className="iti-load-utils",e.async=!0,e.src=a,c.body.appendChild(e)}
;b.intlTelInputGlobals.loadUtils=function(a){if(!b.intlTelInputUtils&&!b.intlTelInputGlobals.startedLoadingUtilsScript){if(b.intlTelInputGlobals.startedLoadingUtilsScript=!0,"undefined"!=typeof Promise)return new Promise(function(b,c){return q(a,b,c)});q(a)}return null},b.intlTelInputGlobals.defaults=l,b.intlTelInputGlobals.version="14.0.2";a.fn.intlTelInput=function(c){var e=arguments;if(c===d||"object"==typeof c)return this.each(function(){if(!a.data(this,"plugin_intlTelInput")){var d=new p(this,c);d._init(),b.intlTelInputGlobals.instances[d.id]=d,a.data(this,"plugin_intlTelInput",d)}});if("string"==typeof c&&"_"!==c[0]){var f;return this.each(function(){var b=a.data(this,"plugin_intlTelInput");b instanceof p&&"function"==typeof b[c]&&(f=b[c].apply(b,Array.prototype.slice.call(e,1))),"destroy"===c&&a.data(this,"plugin_intlTelInput",null)}),f!==d?f:this}}});
/*!
 * Name    : Just Another Parallax [Jarallax]
 * Version : 1.10.3
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/jarallax
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

    "use strict";
    /* WEBPACK VAR INJECTION */(function(global) {
    
    var win;
    
    if (typeof window !== "undefined") {
        win = window;
    } else if (typeof global !== "undefined") {
        win = global;
    } else if (typeof self !== "undefined") {
        win = self;
    } else {
        win = {};
    }
    
    module.exports = win;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    module.exports = function (callback) {
    
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // Already ready or interactive, execute callback
            callback.call();
        } else if (document.attachEvent) {
            // Old browsers
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState === 'interactive') callback.call();
            });
        } else if (document.addEventListener) {
            // Modern browsers
            document.addEventListener('DOMContentLoaded', callback);
        }
    };
    
    /***/ }),
    /* 2 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var g;
    
    // This works in non-strict mode
    g = function () {
        return this;
    }();
    
    try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1, eval)("this");
    } catch (e) {
        // This works if the window reference is available
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
    }
    
    // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}
    
    module.exports = g;
    
    /***/ }),
    /* 3 */,
    /* 4 */,
    /* 5 */,
    /* 6 */,
    /* 7 */,
    /* 8 */,
    /* 9 */,
    /* 10 */,
    /* 11 */
    /***/ (function(module, exports, __webpack_require__) {
    
    module.exports = __webpack_require__(12);
    
    
    /***/ }),
    /* 12 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var _liteReady = __webpack_require__(1);
    
    var _liteReady2 = _interopRequireDefault(_liteReady);
    
    var _global = __webpack_require__(0);
    
    var _jarallax = __webpack_require__(13);
    
    var _jarallax2 = _interopRequireDefault(_jarallax);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    // no conflict
    var oldPlugin = _global.window.jarallax;
    _global.window.jarallax = _jarallax2.default;
    _global.window.jarallax.noConflict = function () {
        _global.window.jarallax = oldPlugin;
        return this;
    };
    
    // jQuery support
    if (typeof _global.jQuery !== 'undefined') {
        var jQueryPlugin = function jQueryPlugin() {
            var args = arguments || [];
            Array.prototype.unshift.call(args, this);
            var res = _jarallax2.default.apply(_global.window, args);
            return (typeof res === 'undefined' ? 'undefined' : _typeof(res)) !== 'object' ? res : this;
        };
        jQueryPlugin.constructor = _jarallax2.default.constructor;
    
        // no conflict
        var oldJqPlugin = _global.jQuery.fn.jarallax;
        _global.jQuery.fn.jarallax = jQueryPlugin;
        _global.jQuery.fn.jarallax.noConflict = function () {
            _global.jQuery.fn.jarallax = oldJqPlugin;
            return this;
        };
    }
    
    // data-jarallax initialization
    (0, _liteReady2.default)(function () {
        (0, _jarallax2.default)(document.querySelectorAll('[data-jarallax]'));
    });
    
    /***/ }),
    /* 13 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(global) {
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var _liteReady = __webpack_require__(1);
    
    var _liteReady2 = _interopRequireDefault(_liteReady);
    
    var _rafl = __webpack_require__(14);
    
    var _rafl2 = _interopRequireDefault(_rafl);
    
    var _global = __webpack_require__(0);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var supportTransform = function () {
        var prefixes = 'transform WebkitTransform MozTransform'.split(' ');
        var div = document.createElement('div');
        for (var i = 0; i < prefixes.length; i++) {
            if (div && div.style[prefixes[i]] !== undefined) {
                return prefixes[i];
            }
        }
        return false;
    }();
    
    // Window data
    var wndW = void 0;
    var wndH = void 0;
    var wndY = void 0;
    var forceResizeParallax = false;
    var forceScrollParallax = false;
    function updateWndVars(e) {
        wndW = _global.window.innerWidth || document.documentElement.clientWidth;
        wndH = _global.window.innerHeight || document.documentElement.clientHeight;
        if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object' && (e.type === 'load' || e.type === 'dom-loaded')) {
            forceResizeParallax = true;
        }
    }
    updateWndVars();
    _global.window.addEventListener('resize', updateWndVars);
    _global.window.addEventListener('orientationchange', updateWndVars);
    _global.window.addEventListener('load', updateWndVars);
    (0, _liteReady2.default)(function () {
        updateWndVars({
            type: 'dom-loaded'
        });
    });
    
    // list with all jarallax instances
    // need to render all in one scroll/resize event
    var jarallaxList = [];
    
    // Animate if changed window size or scrolled page
    var oldPageData = false;
    function updateParallax() {
        if (!jarallaxList.length) {
            return;
        }
    
        if (_global.window.pageYOffset !== undefined) {
            wndY = _global.window.pageYOffset;
        } else {
            wndY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
        }
    
        var isResized = forceResizeParallax || !oldPageData || oldPageData.width !== wndW || oldPageData.height !== wndH;
        var isScrolled = forceScrollParallax || isResized || !oldPageData || oldPageData.y !== wndY;
    
        forceResizeParallax = false;
        forceScrollParallax = false;
    
        if (isResized || isScrolled) {
            jarallaxList.forEach(function (item) {
                if (isResized) {
                    item.onResize();
                }
                if (isScrolled) {
                    item.onScroll();
                }
            });
    
            oldPageData = {
                width: wndW,
                height: wndH,
                y: wndY
            };
        }
    
        (0, _rafl2.default)(updateParallax);
    }
    
    // ResizeObserver
    var resizeObserver = global.ResizeObserver ? new global.ResizeObserver(function (entry) {
        if (entry && entry.length) {
            (0, _rafl2.default)(function () {
                entry.forEach(function (item) {
                    if (item.target && item.target.jarallax) {
                        if (!forceResizeParallax) {
                            item.target.jarallax.onResize();
                        }
                        forceScrollParallax = true;
                    }
                });
            });
        }
    }) : false;
    
    var instanceID = 0;
    
    // Jarallax class
    
    var Jarallax = function () {
        function Jarallax(item, userOptions) {
            _classCallCheck(this, Jarallax);
    
            var self = this;
    
            self.instanceID = instanceID++;
    
            self.$item = item;
    
            self.defaults = {
                type: 'scroll', // type of parallax: scroll, scale, opacity, scale-opacity, scroll-opacity
                speed: 0.5, // supported value from -1 to 2
                imgSrc: null,
                imgElement: '.jarallax-img',
                imgSize: 'cover',
                imgPosition: '50% 50%',
                imgRepeat: 'no-repeat', // supported only for background, not for <img> tag
                keepImg: false, // keep <img> tag in it's default place
                elementInViewport: null,
                zIndex: -100,
                disableParallax: false,
                disableVideo: false,
                automaticResize: true, // use ResizeObserver to recalculate position and size of parallax image
    
                // video
                videoSrc: null,
                videoStartTime: 0,
                videoEndTime: 0,
                videoVolume: 0,
                videoPlayOnlyVisible: true,
    
                // events
                onScroll: null, // function(calculations) {}
                onInit: null, // function() {}
                onDestroy: null, // function() {}
                onCoverImage: null // function() {}
            };
    
            // DEPRECATED: old data-options
            var deprecatedDataAttribute = self.$item.getAttribute('data-jarallax');
            var oldDataOptions = JSON.parse(deprecatedDataAttribute || '{}');
            if (deprecatedDataAttribute) {
                // eslint-disable-next-line no-console
                console.warn('Detected usage of deprecated data-jarallax JSON options, you should use pure data-attribute options. See info here - https://github.com/nk-o/jarallax/issues/53');
            }
    
            // prepare data-options
            var dataOptions = self.$item.dataset || {};
            var pureDataOptions = {};
            Object.keys(dataOptions).forEach(function (key) {
                var loweCaseOption = key.substr(0, 1).toLowerCase() + key.substr(1);
                if (loweCaseOption && typeof self.defaults[loweCaseOption] !== 'undefined') {
                    pureDataOptions[loweCaseOption] = dataOptions[key];
                }
            });
    
            self.options = self.extend({}, self.defaults, oldDataOptions, pureDataOptions, userOptions);
            self.pureOptions = self.extend({}, self.options);
    
            // prepare 'true' and 'false' strings to boolean
            Object.keys(self.options).forEach(function (key) {
                if (self.options[key] === 'true') {
                    self.options[key] = true;
                } else if (self.options[key] === 'false') {
                    self.options[key] = false;
                }
            });
    
            // fix speed option [-1.0, 2.0]
            self.options.speed = Math.min(2, Math.max(-1, parseFloat(self.options.speed)));
    
            // deprecated noAndroid and noIos options
            if (self.options.noAndroid || self.options.noIos) {
                // eslint-disable-next-line no-console
                console.warn('Detected usage of deprecated noAndroid or noIos options, you should use disableParallax option. See info here - https://github.com/nk-o/jarallax/#disable-on-mobile-devices');
    
                // prepare fallback if disableParallax option is not used
                if (!self.options.disableParallax) {
                    if (self.options.noIos && self.options.noAndroid) {
                        self.options.disableParallax = /iPad|iPhone|iPod|Android/;
                    } else if (self.options.noIos) {
                        self.options.disableParallax = /iPad|iPhone|iPod/;
                    } else if (self.options.noAndroid) {
                        self.options.disableParallax = /Android/;
                    }
                }
            }
    
            // prepare disableParallax callback
            if (typeof self.options.disableParallax === 'string') {
                self.options.disableParallax = new RegExp(self.options.disableParallax);
            }
            if (self.options.disableParallax instanceof RegExp) {
                var disableParallaxRegexp = self.options.disableParallax;
                self.options.disableParallax = function () {
                    return disableParallaxRegexp.test(navigator.userAgent);
                };
            }
            if (typeof self.options.disableParallax !== 'function') {
                self.options.disableParallax = function () {
                    return false;
                };
            }
    
            // prepare disableVideo callback
            if (typeof self.options.disableVideo === 'string') {
                self.options.disableVideo = new RegExp(self.options.disableVideo);
            }
            if (self.options.disableVideo instanceof RegExp) {
                var disableVideoRegexp = self.options.disableVideo;
                self.options.disableVideo = function () {
                    return disableVideoRegexp.test(navigator.userAgent);
                };
            }
            if (typeof self.options.disableVideo !== 'function') {
                self.options.disableVideo = function () {
                    return false;
                };
            }
    
            // custom element to check if parallax in viewport
            var elementInVP = self.options.elementInViewport;
            // get first item from array
            if (elementInVP && (typeof elementInVP === 'undefined' ? 'undefined' : _typeof(elementInVP)) === 'object' && typeof elementInVP.length !== 'undefined') {
                var _elementInVP = elementInVP;
    
                var _elementInVP2 = _slicedToArray(_elementInVP, 1);
    
                elementInVP = _elementInVP2[0];
            }
            // check if dom element
            if (!(elementInVP instanceof Element)) {
                elementInVP = null;
            }
            self.options.elementInViewport = elementInVP;
    
            self.image = {
                src: self.options.imgSrc || null,
                $container: null,
                useImgTag: false,
    
                // position fixed is needed for the most of browsers because absolute position have glitches
                // on MacOS with smooth scroll there is a huge lags with absolute position - https://github.com/nk-o/jarallax/issues/75
                // on mobile devices better scrolled with absolute position
                position: /iPad|iPhone|iPod|Android/.test(navigator.userAgent) ? 'absolute' : 'fixed'
            };
    
            if (self.initImg() && self.canInitParallax()) {
                self.init();
            }
        }
    
        // add styles to element
    
    
        _createClass(Jarallax, [{
            key: 'css',
            value: function css(el, styles) {
                if (typeof styles === 'string') {
                    return _global.window.getComputedStyle(el).getPropertyValue(styles);
                }
    
                // add transform property with vendor prefix
                if (styles.transform && supportTransform) {
                    styles[supportTransform] = styles.transform;
                }
    
                Object.keys(styles).forEach(function (key) {
                    el.style[key] = styles[key];
                });
                return el;
            }
    
            // Extend like jQuery.extend
    
        }, {
            key: 'extend',
            value: function extend(out) {
                var _arguments = arguments;
    
                out = out || {};
                Object.keys(arguments).forEach(function (i) {
                    if (!_arguments[i]) {
                        return;
                    }
                    Object.keys(_arguments[i]).forEach(function (key) {
                        out[key] = _arguments[i][key];
                    });
                });
                return out;
            }
    
            // get window size and scroll position. Useful for extensions
    
        }, {
            key: 'getWindowData',
            value: function getWindowData() {
                return {
                    width: wndW,
                    height: wndH,
                    y: wndY
                };
            }
    
            // Jarallax functions
    
        }, {
            key: 'initImg',
            value: function initImg() {
                var self = this;
    
                // find image element
                var $imgElement = self.options.imgElement;
                if ($imgElement && typeof $imgElement === 'string') {
                    $imgElement = self.$item.querySelector($imgElement);
                }
                // check if dom element
                if (!($imgElement instanceof Element)) {
                    $imgElement = null;
                }
    
                if ($imgElement) {
                    if (self.options.keepImg) {
                        self.image.$item = $imgElement.cloneNode(true);
                    } else {
                        self.image.$item = $imgElement;
                        self.image.$itemParent = $imgElement.parentNode;
                    }
                    self.image.useImgTag = true;
                }
    
                // true if there is img tag
                if (self.image.$item) {
                    return true;
                }
    
                // get image src
                if (self.image.src === null) {
                    self.image.src = self.css(self.$item, 'background-image').replace(/^url\(['"]?/g, '').replace(/['"]?\)$/g, '');
                }
                return !(!self.image.src || self.image.src === 'none');
            }
        }, {
            key: 'canInitParallax',
            value: function canInitParallax() {
                return supportTransform && !this.options.disableParallax();
            }
        }, {
            key: 'init',
            value: function init() {
                var self = this;
                var containerStyles = {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none'
                };
                var imageStyles = {};
    
                if (!self.options.keepImg) {
                    // save default user styles
                    var curStyle = self.$item.getAttribute('style');
                    if (curStyle) {
                        self.$item.setAttribute('data-jarallax-original-styles', curStyle);
                    }
                    if (self.image.useImgTag) {
                        var curImgStyle = self.image.$item.getAttribute('style');
                        if (curImgStyle) {
                            self.image.$item.setAttribute('data-jarallax-original-styles', curImgStyle);
                        }
                    }
                }
    
                // set relative position and z-index to the parent
                if (self.css(self.$item, 'position') === 'static') {
                    self.css(self.$item, {
                        position: 'relative'
                    });
                }
                if (self.css(self.$item, 'z-index') === 'auto') {
                    self.css(self.$item, {
                        zIndex: 0
                    });
                }
    
                // container for parallax image
                self.image.$container = document.createElement('div');
                self.css(self.image.$container, containerStyles);
                self.css(self.image.$container, {
                    'z-index': self.options.zIndex
                });
                self.image.$container.setAttribute('id', 'jarallax-container-' + self.instanceID);
                self.$item.appendChild(self.image.$container);
    
                // use img tag
                if (self.image.useImgTag) {
                    imageStyles = self.extend({
                        'object-fit': self.options.imgSize,
                        'object-position': self.options.imgPosition,
                        // support for plugin https://github.com/bfred-it/object-fit-images
                        'font-family': 'object-fit: ' + self.options.imgSize + '; object-position: ' + self.options.imgPosition + ';',
                        'max-width': 'none'
                    }, containerStyles, imageStyles);
    
                    // use div with background image
                } else {
                    self.image.$item = document.createElement('div');
                    if (self.image.src) {
                        imageStyles = self.extend({
                            'background-position': self.options.imgPosition,
                            'background-size': self.options.imgSize,
                            'background-repeat': self.options.imgRepeat,
                            'background-image': 'url("' + self.image.src + '")'
                        }, containerStyles, imageStyles);
                    }
                }
    
                if (self.options.type === 'opacity' || self.options.type === 'scale' || self.options.type === 'scale-opacity' || self.options.speed === 1) {
                    self.image.position = 'absolute';
                }
    
                // check if one of parents have transform style (without this check, scroll transform will be inverted if used parallax with position fixed)
                // discussion - https://github.com/nk-o/jarallax/issues/9
                if (self.image.position === 'fixed') {
                    var parentWithTransform = 0;
                    var $itemParents = self.$item;
                    while ($itemParents !== null && $itemParents !== document && parentWithTransform === 0) {
                        var parentTransform = self.css($itemParents, '-webkit-transform') || self.css($itemParents, '-moz-transform') || self.css($itemParents, 'transform');
                        if (parentTransform && parentTransform !== 'none') {
                            parentWithTransform = 1;
                            self.image.position = 'absolute';
                        }
                        $itemParents = $itemParents.parentNode;
                    }
                }
    
                // add position to parallax block
                imageStyles.position = self.image.position;
    
                // insert parallax image
                self.css(self.image.$item, imageStyles);
                self.image.$container.appendChild(self.image.$item);
    
                // set initial position and size
                self.coverImage();
                self.clipContainer();
                self.onScroll(true);
    
                // ResizeObserver
                if (self.options.automaticResize && resizeObserver) {
                    resizeObserver.observe(self.$item);
                }
    
                // call onInit event
                if (self.options.onInit) {
                    self.options.onInit.call(self);
                }
    
                // remove default user background
                if (self.css(self.$item, 'background-image') !== 'none') {
                    self.css(self.$item, {
                        'background-image': 'none'
                    });
                }
    
                self.addToParallaxList();
            }
    
            // add to parallax instances list
    
        }, {
            key: 'addToParallaxList',
            value: function addToParallaxList() {
                jarallaxList.push(this);
    
                if (jarallaxList.length === 1) {
                    updateParallax();
                }
            }
    
            // remove from parallax instances list
    
        }, {
            key: 'removeFromParallaxList',
            value: function removeFromParallaxList() {
                var self = this;
    
                jarallaxList.forEach(function (item, key) {
                    if (item.instanceID === self.instanceID) {
                        jarallaxList.splice(key, 1);
                    }
                });
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                var self = this;
    
                self.removeFromParallaxList();
    
                // return styles on container as before jarallax init
                var originalStylesTag = self.$item.getAttribute('data-jarallax-original-styles');
                self.$item.removeAttribute('data-jarallax-original-styles');
                // null occurs if there is no style tag before jarallax init
                if (!originalStylesTag) {
                    self.$item.removeAttribute('style');
                } else {
                    self.$item.setAttribute('style', originalStylesTag);
                }
    
                if (self.image.useImgTag) {
                    // return styles on img tag as before jarallax init
                    var originalStylesImgTag = self.image.$item.getAttribute('data-jarallax-original-styles');
                    self.image.$item.removeAttribute('data-jarallax-original-styles');
                    // null occurs if there is no style tag before jarallax init
                    if (!originalStylesImgTag) {
                        self.image.$item.removeAttribute('style');
                    } else {
                        self.image.$item.setAttribute('style', originalStylesTag);
                    }
    
                    // move img tag to its default position
                    if (self.image.$itemParent) {
                        self.image.$itemParent.appendChild(self.image.$item);
                    }
                }
    
                // remove additional dom elements
                if (self.$clipStyles) {
                    self.$clipStyles.parentNode.removeChild(self.$clipStyles);
                }
                if (self.image.$container) {
                    self.image.$container.parentNode.removeChild(self.image.$container);
                }
    
                // call onDestroy event
                if (self.options.onDestroy) {
                    self.options.onDestroy.call(self);
                }
    
                // delete jarallax from item
                delete self.$item.jarallax;
            }
    
            // it will remove some image overlapping
            // overlapping occur due to an image position fixed inside absolute position element
    
        }, {
            key: 'clipContainer',
            value: function clipContainer() {
                // needed only when background in fixed position
                if (this.image.position !== 'fixed') {
                    return;
                }
    
                var self = this;
                var rect = self.image.$container.getBoundingClientRect();
                var width = rect.width,
                    height = rect.height;
    
    
                if (!self.$clipStyles) {
                    self.$clipStyles = document.createElement('style');
                    self.$clipStyles.setAttribute('type', 'text/css');
                    self.$clipStyles.setAttribute('id', 'jarallax-clip-' + self.instanceID);
                    var head = document.head || document.getElementsByTagName('head')[0];
                    head.appendChild(self.$clipStyles);
                }
    
                var styles = '#jarallax-container-' + self.instanceID + ' {\n           clip: rect(0 ' + width + 'px ' + height + 'px 0);\n           clip: rect(0, ' + width + 'px, ' + height + 'px, 0);\n        }';
    
                // add clip styles inline (this method need for support IE8 and less browsers)
                if (self.$clipStyles.styleSheet) {
                    self.$clipStyles.styleSheet.cssText = styles;
                } else {
                    self.$clipStyles.innerHTML = styles;
                }
            }
        }, {
            key: 'coverImage',
            value: function coverImage() {
                var self = this;
    
                var rect = self.image.$container.getBoundingClientRect();
                var contH = rect.height;
                var speed = self.options.speed;
    
                var isScroll = self.options.type === 'scroll' || self.options.type === 'scroll-opacity';
                var scrollDist = 0;
                var resultH = contH;
                var resultMT = 0;
    
                // scroll parallax
                if (isScroll) {
                    // scroll distance and height for image
                    if (speed < 0) {
                        scrollDist = speed * Math.max(contH, wndH);
                    } else {
                        scrollDist = speed * (contH + wndH);
                    }
    
                    // size for scroll parallax
                    if (speed > 1) {
                        resultH = Math.abs(scrollDist - wndH);
                    } else if (speed < 0) {
                        resultH = scrollDist / speed + Math.abs(scrollDist);
                    } else {
                        resultH += Math.abs(wndH - contH) * (1 - speed);
                    }
    
                    scrollDist /= 2;
                }
    
                // store scroll distance
                self.parallaxScrollDistance = scrollDist;
    
                // vertical center
                if (isScroll) {
                    resultMT = (wndH - resultH) / 2;
                } else {
                    resultMT = (contH - resultH) / 2;
                }
    
                // apply result to item
                self.css(self.image.$item, {
                    height: resultH + 'px',
                    marginTop: resultMT + 'px',
                    left: self.image.position === 'fixed' ? rect.left + 'px' : '0',
                    width: rect.width + 'px'
                });
    
                // call onCoverImage event
                if (self.options.onCoverImage) {
                    self.options.onCoverImage.call(self);
                }
    
                // return some useful data. Used in the video cover function
                return {
                    image: {
                        height: resultH,
                        marginTop: resultMT
                    },
                    container: rect
                };
            }
        }, {
            key: 'isVisible',
            value: function isVisible() {
                return this.isElementInViewport || false;
            }
        }, {
            key: 'onScroll',
            value: function onScroll(force) {
                var self = this;
    
                var rect = self.$item.getBoundingClientRect();
                var contT = rect.top;
                var contH = rect.height;
                var styles = {};
    
                // check if in viewport
                var viewportRect = rect;
                if (self.options.elementInViewport) {
                    viewportRect = self.options.elementInViewport.getBoundingClientRect();
                }
                self.isElementInViewport = viewportRect.bottom >= 0 && viewportRect.right >= 0 && viewportRect.top <= wndH && viewportRect.left <= wndW;
    
                // stop calculations if item is not in viewport
                if (force ? false : !self.isElementInViewport) {
                    return;
                }
    
                // calculate parallax helping variables
                var beforeTop = Math.max(0, contT);
                var beforeTopEnd = Math.max(0, contH + contT);
                var afterTop = Math.max(0, -contT);
                var beforeBottom = Math.max(0, contT + contH - wndH);
                var beforeBottomEnd = Math.max(0, contH - (contT + contH - wndH));
                var afterBottom = Math.max(0, -contT + wndH - contH);
                var fromViewportCenter = 1 - 2 * (wndH - contT) / (wndH + contH);
    
                // calculate on how percent of section is visible
                var visiblePercent = 1;
                if (contH < wndH) {
                    visiblePercent = 1 - (afterTop || beforeBottom) / contH;
                } else if (beforeTopEnd <= wndH) {
                    visiblePercent = beforeTopEnd / wndH;
                } else if (beforeBottomEnd <= wndH) {
                    visiblePercent = beforeBottomEnd / wndH;
                }
    
                // opacity
                if (self.options.type === 'opacity' || self.options.type === 'scale-opacity' || self.options.type === 'scroll-opacity') {
                    styles.transform = 'translate3d(0,0,0)';
                    styles.opacity = visiblePercent;
                }
    
                // scale
                if (self.options.type === 'scale' || self.options.type === 'scale-opacity') {
                    var scale = 1;
                    if (self.options.speed < 0) {
                        scale -= self.options.speed * visiblePercent;
                    } else {
                        scale += self.options.speed * (1 - visiblePercent);
                    }
                    styles.transform = 'scale(' + scale + ') translate3d(0,0,0)';
                }
    
                // scroll
                if (self.options.type === 'scroll' || self.options.type === 'scroll-opacity') {
                    var positionY = self.parallaxScrollDistance * fromViewportCenter;
    
                    // fix if parallax block in absolute position
                    if (self.image.position === 'absolute') {
                        positionY -= contT;
                    }
    
                    styles.transform = 'translate3d(0,' + positionY + 'px,0)';
                }
    
                self.css(self.image.$item, styles);
    
                // call onScroll event
                if (self.options.onScroll) {
                    self.options.onScroll.call(self, {
                        section: rect,
    
                        beforeTop: beforeTop,
                        beforeTopEnd: beforeTopEnd,
                        afterTop: afterTop,
                        beforeBottom: beforeBottom,
                        beforeBottomEnd: beforeBottomEnd,
                        afterBottom: afterBottom,
    
                        visiblePercent: visiblePercent,
                        fromViewportCenter: fromViewportCenter
                    });
                }
            }
        }, {
            key: 'onResize',
            value: function onResize() {
                this.coverImage();
                this.clipContainer();
            }
        }]);
    
        return Jarallax;
    }();
    
    // global definition
    
    
    var plugin = function plugin(items) {
        // check for dom element
        // thanks: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
        if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? items instanceof HTMLElement : items && (typeof items === 'undefined' ? 'undefined' : _typeof(items)) === 'object' && items !== null && items.nodeType === 1 && typeof items.nodeName === 'string') {
            items = [items];
        }
    
        var options = arguments[1];
        var args = Array.prototype.slice.call(arguments, 2);
        var len = items.length;
        var k = 0;
        var ret = void 0;
    
        for (k; k < len; k++) {
            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' || typeof options === 'undefined') {
                if (!items[k].jarallax) {
                    items[k].jarallax = new Jarallax(items[k], options);
                }
            } else if (items[k].jarallax) {
                // eslint-disable-next-line prefer-spread
                ret = items[k].jarallax[options].apply(items[k].jarallax, args);
            }
            if (typeof ret !== 'undefined') {
                return ret;
            }
        }
    
        return items;
    };
    plugin.constructor = Jarallax;
    
    exports.default = plugin;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))
    
    /***/ }),
    /* 14 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var global = __webpack_require__(0);
    
    /**
     * `requestAnimationFrame()`
     */
    
    var request = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || fallback;
    
    var prev = +new Date();
    function fallback(fn) {
      var curr = +new Date();
      var ms = Math.max(0, 16 - (curr - prev));
      var req = setTimeout(fn, ms);
      return prev = curr, req;
    }
    
    /**
     * `cancelAnimationFrame()`
     */
    
    var cancel = global.cancelAnimationFrame || global.webkitCancelAnimationFrame || global.mozCancelAnimationFrame || clearTimeout;
    
    if (Function.prototype.bind) {
      request = request.bind(global);
      cancel = cancel.bind(global);
    }
    
    exports = module.exports = request;
    exports.cancel = cancel;
    
    /***/ })
    /******/ ]);

    /*!
 * Name    : Video Background Extension for Jarallax
 * Version : 1.0.1
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/jarallax
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined") {
    win = self;
} else {
    win = {};
}

module.exports = win;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (callback) {

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		// Already ready or interactive, execute callback
		callback.call();
	} else if (document.attachEvent) {
		// Old browsers
		document.attachEvent('onreadystatechange', function () {
			if (document.readyState === 'interactive') callback.call();
		});
	} else if (document.addEventListener) {
		// Modern browsers
		document.addEventListener('DOMContentLoaded', callback);
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(9);

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _videoWorker = __webpack_require__(3);

var _videoWorker2 = _interopRequireDefault(_videoWorker);

var _global = __webpack_require__(0);

var _global2 = _interopRequireDefault(_global);

var _liteReady = __webpack_require__(1);

var _liteReady2 = _interopRequireDefault(_liteReady);

var _jarallaxVideo = __webpack_require__(10);

var _jarallaxVideo2 = _interopRequireDefault(_jarallaxVideo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// add video worker globally to fallback jarallax < 1.10 versions
_global2.default.VideoWorker = _global2.default.VideoWorker || _videoWorker2.default;

(0, _jarallaxVideo2.default)();

// data-jarallax-video initialization
(0, _liteReady2.default)(function () {
    if (typeof jarallax !== 'undefined') {
        jarallax(document.querySelectorAll('[data-jarallax-video]'));
    }
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Deferred
// thanks http://stackoverflow.com/questions/18096715/implement-deferred-object-without-using-jquery
function Deferred() {
    this._done = [];
    this._fail = [];
}
Deferred.prototype = {
    execute: function execute(list, args) {
        var i = list.length;
        args = Array.prototype.slice.call(args);
        while (i--) {
            list[i].apply(null, args);
        }
    },
    resolve: function resolve() {
        this.execute(this._done, arguments);
    },
    reject: function reject() {
        this.execute(this._fail, arguments);
    },
    done: function done(callback) {
        this._done.push(callback);
    },
    fail: function fail(callback) {
        this._fail.push(callback);
    }
};

var ID = 0;
var YoutubeAPIadded = 0;
var VimeoAPIadded = 0;
var loadingYoutubePlayer = 0;
var loadingVimeoPlayer = 0;
var loadingYoutubeDefer = new Deferred();
var loadingVimeoDefer = new Deferred();

var VideoWorker = function () {
    function VideoWorker(url, options) {
        _classCallCheck(this, VideoWorker);

        var self = this;

        self.url = url;

        self.options_default = {
            autoplay: false,
            loop: false,
            mute: false,
            volume: 100,
            showContols: true,

            // start / end video time in seconds
            startTime: 0,
            endTime: 0
        };

        self.options = self.extend({}, self.options_default, options);

        // check URL
        self.videoID = self.parseURL(url);

        // init
        if (self.videoID) {
            self.ID = ID++;
            self.loadAPI();
            self.init();
        }
    }

    // Extend like jQuery.extend


    _createClass(VideoWorker, [{
        key: 'extend',
        value: function extend(out) {
            var _arguments = arguments;

            out = out || {};
            Object.keys(arguments).forEach(function (i) {
                if (!_arguments[i]) {
                    return;
                }
                Object.keys(_arguments[i]).forEach(function (key) {
                    out[key] = _arguments[i][key];
                });
            });
            return out;
        }
    }, {
        key: 'parseURL',
        value: function parseURL(url) {
            // parse youtube ID
            function getYoutubeID(ytUrl) {
                // eslint-disable-next-line no-useless-escape
                var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                var match = ytUrl.match(regExp);
                return match && match[1].length === 11 ? match[1] : false;
            }

            // parse vimeo ID
            function getVimeoID(vmUrl) {
                // eslint-disable-next-line no-useless-escape
                var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
                var match = vmUrl.match(regExp);
                return match && match[3] ? match[3] : false;
            }

            // parse local string
            function getLocalVideos(locUrl) {
                // eslint-disable-next-line no-useless-escape
                var videoFormats = locUrl.split(/,(?=mp4\:|webm\:|ogv\:|ogg\:)/);
                var result = {};
                var ready = 0;
                videoFormats.forEach(function (val) {
                    // eslint-disable-next-line no-useless-escape
                    var match = val.match(/^(mp4|webm|ogv|ogg)\:(.*)/);
                    if (match && match[1] && match[2]) {
                        // eslint-disable-next-line prefer-destructuring
                        result[match[1] === 'ogv' ? 'ogg' : match[1]] = match[2];
                        ready = 1;
                    }
                });
                return ready ? result : false;
            }

            var Youtube = getYoutubeID(url);
            var Vimeo = getVimeoID(url);
            var Local = getLocalVideos(url);

            if (Youtube) {
                this.type = 'youtube';
                return Youtube;
            } else if (Vimeo) {
                this.type = 'vimeo';
                return Vimeo;
            } else if (Local) {
                this.type = 'local';
                return Local;
            }

            return false;
        }
    }, {
        key: 'isValid',
        value: function isValid() {
            return !!this.videoID;
        }

        // events

    }, {
        key: 'on',
        value: function on(name, callback) {
            this.userEventsList = this.userEventsList || [];

            // add new callback in events list
            (this.userEventsList[name] || (this.userEventsList[name] = [])).push(callback);
        }
    }, {
        key: 'off',
        value: function off(name, callback) {
            var _this = this;

            if (!this.userEventsList || !this.userEventsList[name]) {
                return;
            }

            if (!callback) {
                delete this.userEventsList[name];
            } else {
                this.userEventsList[name].forEach(function (val, key) {
                    if (val === callback) {
                        _this.userEventsList[name][key] = false;
                    }
                });
            }
        }
    }, {
        key: 'fire',
        value: function fire(name) {
            var _this2 = this;

            var args = [].slice.call(arguments, 1);
            if (this.userEventsList && typeof this.userEventsList[name] !== 'undefined') {
                this.userEventsList[name].forEach(function (val) {
                    // call with all arguments
                    if (val) {
                        val.apply(_this2, args);
                    }
                });
            }
        }
    }, {
        key: 'play',
        value: function play(start) {
            var self = this;
            if (!self.player) {
                return;
            }

            if (self.type === 'youtube' && self.player.playVideo) {
                if (typeof start !== 'undefined') {
                    self.player.seekTo(start || 0);
                }
                if (YT.PlayerState.PLAYING !== self.player.getPlayerState()) {
                    self.player.playVideo();
                }
            }

            if (self.type === 'vimeo') {
                if (typeof start !== 'undefined') {
                    self.player.setCurrentTime(start);
                }
                self.player.getPaused().then(function (paused) {
                    if (paused) {
                        self.player.play();
                    }
                });
            }

            if (self.type === 'local') {
                if (typeof start !== 'undefined') {
                    self.player.currentTime = start;
                }
                if (self.player.paused) {
                    self.player.play();
                }
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            var self = this;
            if (!self.player) {
                return;
            }

            if (self.type === 'youtube' && self.player.pauseVideo) {
                if (YT.PlayerState.PLAYING === self.player.getPlayerState()) {
                    self.player.pauseVideo();
                }
            }

            if (self.type === 'vimeo') {
                self.player.getPaused().then(function (paused) {
                    if (!paused) {
                        self.player.pause();
                    }
                });
            }

            if (self.type === 'local') {
                if (!self.player.paused) {
                    self.player.pause();
                }
            }
        }
    }, {
        key: 'mute',
        value: function mute() {
            var self = this;
            if (!self.player) {
                return;
            }

            if (self.type === 'youtube' && self.player.mute) {
                self.player.mute();
            }

            if (self.type === 'vimeo' && self.player.setVolume) {
                self.player.setVolume(0);
            }

            if (self.type === 'local') {
                self.$video.muted = true;
            }
        }
    }, {
        key: 'unmute',
        value: function unmute() {
            var self = this;
            if (!self.player) {
                return;
            }

            if (self.type === 'youtube' && self.player.mute) {
                self.player.unMute();
            }

            if (self.type === 'vimeo' && self.player.setVolume) {
                self.player.setVolume(self.options.volume);
            }

            if (self.type === 'local') {
                self.$video.muted = false;
            }
        }
    }, {
        key: 'setVolume',
        value: function setVolume() {
            var volume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var self = this;
            if (!self.player || !volume) {
                return;
            }

            if (self.type === 'youtube' && self.player.setVolume) {
                self.player.setVolume(volume);
            }

            if (self.type === 'vimeo' && self.player.setVolume) {
                self.player.setVolume(volume);
            }

            if (self.type === 'local') {
                self.$video.volume = volume / 100;
            }
        }
    }, {
        key: 'getVolume',
        value: function getVolume(callback) {
            var self = this;
            if (!self.player) {
                callback(false);
                return;
            }

            if (self.type === 'youtube' && self.player.getVolume) {
                callback(self.player.getVolume());
            }

            if (self.type === 'vimeo' && self.player.getVolume) {
                self.player.getVolume().then(function (volume) {
                    callback(volume);
                });
            }

            if (self.type === 'local') {
                callback(self.$video.volume * 100);
            }
        }
    }, {
        key: 'getMuted',
        value: function getMuted(callback) {
            var self = this;
            if (!self.player) {
                callback(null);
                return;
            }

            if (self.type === 'youtube' && self.player.isMuted) {
                callback(self.player.isMuted());
            }

            if (self.type === 'vimeo' && self.player.getVolume) {
                self.player.getVolume().then(function (volume) {
                    callback(!!volume);
                });
            }

            if (self.type === 'local') {
                callback(self.$video.muted);
            }
        }
    }, {
        key: 'getImageURL',
        value: function getImageURL(callback) {
            var self = this;

            if (self.videoImage) {
                callback(self.videoImage);
                return;
            }

            if (self.type === 'youtube') {
                var availableSizes = ['maxresdefault', 'sddefault', 'hqdefault', '0'];
                var step = 0;

                var tempImg = new Image();
                tempImg.onload = function () {
                    // if no thumbnail, youtube add their own image with width = 120px
                    if ((this.naturalWidth || this.width) !== 120 || step === availableSizes.length - 1) {
                        // ok
                        self.videoImage = 'https://img.youtube.com/vi/' + self.videoID + '/' + availableSizes[step] + '.jpg';
                        callback(self.videoImage);
                    } else {
                        // try another size
                        step++;
                        this.src = 'https://img.youtube.com/vi/' + self.videoID + '/' + availableSizes[step] + '.jpg';
                    }
                };
                tempImg.src = 'https://img.youtube.com/vi/' + self.videoID + '/' + availableSizes[step] + '.jpg';
            }

            if (self.type === 'vimeo') {
                var request = new XMLHttpRequest();
                request.open('GET', 'https://vimeo.com/api/v2/video/' + self.videoID + '.json', true);
                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status >= 200 && this.status < 400) {
                            // Success!
                            var response = JSON.parse(this.responseText);
                            self.videoImage = response[0].thumbnail_large;
                            callback(self.videoImage);
                        } else {
                            // Error :(
                        }
                    }
                };
                request.send();
                request = null;
            }
        }

        // fallback to the old version.

    }, {
        key: 'getIframe',
        value: function getIframe(callback) {
            this.getVideo(callback);
        }
    }, {
        key: 'getVideo',
        value: function getVideo(callback) {
            var self = this;

            // return generated video block
            if (self.$video) {
                callback(self.$video);
                return;
            }

            // generate new video block
            self.onAPIready(function () {
                var hiddenDiv = void 0;
                if (!self.$video) {
                    hiddenDiv = document.createElement('div');
                    hiddenDiv.style.display = 'none';
                }

                // Youtube
                if (self.type === 'youtube') {
                    self.playerOptions = {};
                    self.playerOptions.videoId = self.videoID;
                    self.playerOptions.playerVars = {
                        autohide: 1,
                        rel: 0,
                        autoplay: 0,
                        // autoplay enable on mobile devices
                        playsinline: 1
                    };

                    // hide controls
                    if (!self.options.showContols) {
                        self.playerOptions.playerVars.iv_load_policy = 3;
                        self.playerOptions.playerVars.modestbranding = 1;
                        self.playerOptions.playerVars.controls = 0;
                        self.playerOptions.playerVars.showinfo = 0;
                        self.playerOptions.playerVars.disablekb = 1;
                    }

                    // events
                    var ytStarted = void 0;
                    var ytProgressInterval = void 0;
                    self.playerOptions.events = {
                        onReady: function onReady(e) {
                            // mute
                            if (self.options.mute) {
                                e.target.mute();
                            } else if (self.options.volume) {
                                e.target.setVolume(self.options.volume);
                            }

                            // autoplay
                            if (self.options.autoplay) {
                                self.play(self.options.startTime);
                            }
                            self.fire('ready', e);

                            // volumechange
                            setInterval(function () {
                                self.getVolume(function (volume) {
                                    if (self.options.volume !== volume) {
                                        self.options.volume = volume;
                                        self.fire('volumechange', e);
                                    }
                                });
                            }, 150);
                        },
                        onStateChange: function onStateChange(e) {
                            // loop
                            if (self.options.loop && e.data === YT.PlayerState.ENDED) {
                                self.play(self.options.startTime);
                            }
                            if (!ytStarted && e.data === YT.PlayerState.PLAYING) {
                                ytStarted = 1;
                                self.fire('started', e);
                            }
                            if (e.data === YT.PlayerState.PLAYING) {
                                self.fire('play', e);
                            }
                            if (e.data === YT.PlayerState.PAUSED) {
                                self.fire('pause', e);
                            }
                            if (e.data === YT.PlayerState.ENDED) {
                                self.fire('ended', e);
                            }

                            // progress check
                            if (e.data === YT.PlayerState.PLAYING) {
                                ytProgressInterval = setInterval(function () {
                                    self.fire('timeupdate', e);

                                    // check for end of video and play again or stop
                                    if (self.options.endTime && self.player.getCurrentTime() >= self.options.endTime) {
                                        if (self.options.loop) {
                                            self.play(self.options.startTime);
                                        } else {
                                            self.pause();
                                        }
                                    }
                                }, 150);
                            } else {
                                clearInterval(ytProgressInterval);
                            }
                        }
                    };

                    var firstInit = !self.$video;
                    if (firstInit) {
                        var div = document.createElement('div');
                        div.setAttribute('id', self.playerID);
                        hiddenDiv.appendChild(div);
                        document.body.appendChild(hiddenDiv);
                    }
                    self.player = self.player || new window.YT.Player(self.playerID, self.playerOptions);
                    if (firstInit) {
                        self.$video = document.getElementById(self.playerID);

                        // get video width and height
                        self.videoWidth = parseInt(self.$video.getAttribute('width'), 10) || 1280;
                        self.videoHeight = parseInt(self.$video.getAttribute('height'), 10) || 720;
                    }
                }

                // Vimeo
                if (self.type === 'vimeo') {
                    self.playerOptions = '';

                    self.playerOptions += 'player_id=' + self.playerID;
                    self.playerOptions += '&autopause=0';
                    self.playerOptions += '&transparent=0';

                    // hide controls
                    if (!self.options.showContols) {
                        self.playerOptions += '&badge=0&byline=0&portrait=0&title=0';
                    }

                    // autoplay
                    self.playerOptions += '&autoplay=' + (self.options.autoplay ? '1' : '0');

                    // loop
                    self.playerOptions += '&loop=' + (self.options.loop ? 1 : 0);

                    if (!self.$video) {
                        self.$video = document.createElement('iframe');
                        self.$video.setAttribute('id', self.playerID);
                        self.$video.setAttribute('src', 'https://player.vimeo.com/video/' + self.videoID + '?' + self.playerOptions);
                        self.$video.setAttribute('frameborder', '0');
                        hiddenDiv.appendChild(self.$video);
                        document.body.appendChild(hiddenDiv);
                    }

                    self.player = self.player || new Vimeo.Player(self.$video);

                    // get video width and height
                    self.player.getVideoWidth().then(function (width) {
                        self.videoWidth = width || 1280;
                    });
                    self.player.getVideoHeight().then(function (height) {
                        self.videoHeight = height || 720;
                    });

                    // set current time for autoplay
                    if (self.options.startTime && self.options.autoplay) {
                        self.player.setCurrentTime(self.options.startTime);
                    }

                    // mute
                    if (self.options.mute) {
                        self.player.setVolume(0);
                    } else if (self.options.volume) {
                        self.player.setVolume(self.options.volume);
                    }

                    var vmStarted = void 0;
                    self.player.on('timeupdate', function (e) {
                        if (!vmStarted) {
                            self.fire('started', e);
                            vmStarted = 1;
                        }

                        self.fire('timeupdate', e);

                        // check for end of video and play again or stop
                        if (self.options.endTime) {
                            if (self.options.endTime && e.seconds >= self.options.endTime) {
                                if (self.options.loop) {
                                    self.play(self.options.startTime);
                                } else {
                                    self.pause();
                                }
                            }
                        }
                    });
                    self.player.on('play', function (e) {
                        self.fire('play', e);

                        // check for the start time and start with it
                        if (self.options.startTime && e.seconds === 0) {
                            self.play(self.options.startTime);
                        }
                    });
                    self.player.on('pause', function (e) {
                        self.fire('pause', e);
                    });
                    self.player.on('ended', function (e) {
                        self.fire('ended', e);
                    });
                    self.player.on('loaded', function (e) {
                        self.fire('ready', e);
                    });
                    self.player.on('volumechange', function (e) {
                        self.fire('volumechange', e);
                    });
                }

                // Local
                function addSourceToLocal(element, src, type) {
                    var source = document.createElement('source');
                    source.src = src;
                    source.type = type;
                    element.appendChild(source);
                }
                if (self.type === 'local') {
                    if (!self.$video) {
                        self.$video = document.createElement('video');

                        // mute
                        if (self.options.mute) {
                            self.$video.muted = true;
                        } else if (self.$video.volume) {
                            self.$video.volume = self.options.volume / 100;
                        }

                        // loop
                        if (self.options.loop) {
                            self.$video.loop = true;
                        }

                        // autoplay enable on mobile devices
                        self.$video.setAttribute('playsinline', '');
                        self.$video.setAttribute('webkit-playsinline', '');

                        self.$video.setAttribute('id', self.playerID);
                        hiddenDiv.appendChild(self.$video);
                        document.body.appendChild(hiddenDiv);

                        Object.keys(self.videoID).forEach(function (key) {
                            addSourceToLocal(self.$video, self.videoID[key], 'video/' + key);
                        });
                    }

                    self.player = self.player || self.$video;

                    var locStarted = void 0;
                    self.player.addEventListener('playing', function (e) {
                        if (!locStarted) {
                            self.fire('started', e);
                        }
                        locStarted = 1;
                    });
                    self.player.addEventListener('timeupdate', function (e) {
                        self.fire('timeupdate', e);

                        // check for end of video and play again or stop
                        if (self.options.endTime) {
                            if (self.options.endTime && this.currentTime >= self.options.endTime) {
                                if (self.options.loop) {
                                    self.play(self.options.startTime);
                                } else {
                                    self.pause();
                                }
                            }
                        }
                    });
                    self.player.addEventListener('play', function (e) {
                        self.fire('play', e);
                    });
                    self.player.addEventListener('pause', function (e) {
                        self.fire('pause', e);
                    });
                    self.player.addEventListener('ended', function (e) {
                        self.fire('ended', e);
                    });
                    self.player.addEventListener('loadedmetadata', function () {
                        // get video width and height
                        self.videoWidth = this.videoWidth || 1280;
                        self.videoHeight = this.videoHeight || 720;

                        self.fire('ready');

                        // autoplay
                        if (self.options.autoplay) {
                            self.play(self.options.startTime);
                        }
                    });
                    self.player.addEventListener('volumechange', function (e) {
                        self.getVolume(function (volume) {
                            self.options.volume = volume;
                        });
                        self.fire('volumechange', e);
                    });
                }

                callback(self.$video);
            });
        }
    }, {
        key: 'init',
        value: function init() {
            var self = this;

            self.playerID = 'VideoWorker-' + self.ID;
        }
    }, {
        key: 'loadAPI',
        value: function loadAPI() {
            var self = this;

            if (YoutubeAPIadded && VimeoAPIadded) {
                return;
            }

            var src = '';

            // load Youtube API
            if (self.type === 'youtube' && !YoutubeAPIadded) {
                YoutubeAPIadded = 1;
                src = 'https://www.youtube.com/iframe_api';
            }

            // load Vimeo API
            if (self.type === 'vimeo' && !VimeoAPIadded) {
                VimeoAPIadded = 1;
                src = 'https://player.vimeo.com/api/player.js';
            }

            if (!src) {
                return;
            }

            // add script in head section
            var tag = document.createElement('script');
            var head = document.getElementsByTagName('head')[0];
            tag.src = src;

            head.appendChild(tag);

            head = null;
            tag = null;
        }
    }, {
        key: 'onAPIready',
        value: function onAPIready(callback) {
            var self = this;

            // Youtube
            if (self.type === 'youtube') {
                // Listen for global YT player callback
                if ((typeof YT === 'undefined' || YT.loaded === 0) && !loadingYoutubePlayer) {
                    // Prevents Ready event from being called twice
                    loadingYoutubePlayer = 1;

                    // Creates deferred so, other players know when to wait.
                    window.onYouTubeIframeAPIReady = function () {
                        window.onYouTubeIframeAPIReady = null;
                        loadingYoutubeDefer.resolve('done');
                        callback();
                    };
                } else if ((typeof YT === 'undefined' ? 'undefined' : _typeof(YT)) === 'object' && YT.loaded === 1) {
                    callback();
                } else {
                    loadingYoutubeDefer.done(function () {
                        callback();
                    });
                }
            }

            // Vimeo
            if (self.type === 'vimeo') {
                if (typeof Vimeo === 'undefined' && !loadingVimeoPlayer) {
                    loadingVimeoPlayer = 1;
                    var vimeoInterval = setInterval(function () {
                        if (typeof Vimeo !== 'undefined') {
                            clearInterval(vimeoInterval);
                            loadingVimeoDefer.resolve('done');
                            callback();
                        }
                    }, 20);
                } else if (typeof Vimeo !== 'undefined') {
                    callback();
                } else {
                    loadingVimeoDefer.done(function () {
                        callback();
                    });
                }
            }

            // Local
            if (self.type === 'local') {
                callback();
            }
        }
    }]);

    return VideoWorker;
}();

exports.default = VideoWorker;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = jarallaxVideo;

var _videoWorker = __webpack_require__(3);

var _videoWorker2 = _interopRequireDefault(_videoWorker);

var _global = __webpack_require__(0);

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jarallaxVideo() {
    var jarallax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _global2.default.jarallax;

    if (typeof jarallax === 'undefined') {
        return;
    }

    var Jarallax = jarallax.constructor;

    // append video after init Jarallax
    var defInit = Jarallax.prototype.init;
    Jarallax.prototype.init = function () {
        var self = this;

        defInit.apply(self);

        if (self.video && !self.options.disableVideo()) {
            self.video.getVideo(function (video) {
                var $parent = video.parentNode;
                self.css(video, {
                    position: self.image.position,
                    top: '0px',
                    left: '0px',
                    right: '0px',
                    bottom: '0px',
                    width: '100%',
                    height: '100%',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    margin: 0,
                    zIndex: -1
                });
                self.$video = video;
                self.image.$container.appendChild(video);

                // remove parent video element (created by VideoWorker)
                $parent.parentNode.removeChild($parent);
            });
        }
    };

    // cover video
    var defCoverImage = Jarallax.prototype.coverImage;
    Jarallax.prototype.coverImage = function () {
        var self = this;
        var imageData = defCoverImage.apply(self);
        var node = self.image.$item ? self.image.$item.nodeName : false;

        if (imageData && self.video && node && (node === 'IFRAME' || node === 'VIDEO')) {
            var h = imageData.image.height;
            var w = h * self.image.width / self.image.height;
            var ml = (imageData.container.width - w) / 2;
            var mt = imageData.image.marginTop;

            if (imageData.container.width > w) {
                w = imageData.container.width;
                h = w * self.image.height / self.image.width;
                ml = 0;
                mt += (imageData.image.height - h) / 2;
            }

            // add video height over than need to hide controls
            if (node === 'IFRAME') {
                h += 400;
                mt -= 200;
            }

            self.css(self.$video, {
                width: w + 'px',
                marginLeft: ml + 'px',
                height: h + 'px',
                marginTop: mt + 'px'
            });
        }

        return imageData;
    };

    // init video
    var defInitImg = Jarallax.prototype.initImg;
    Jarallax.prototype.initImg = function () {
        var self = this;
        var defaultResult = defInitImg.apply(self);

        if (!self.options.videoSrc) {
            self.options.videoSrc = self.$item.getAttribute('data-jarallax-video') || null;
        }

        if (self.options.videoSrc) {
            self.defaultInitImgResult = defaultResult;
            return true;
        }

        return defaultResult;
    };

    var defCanInitParallax = Jarallax.prototype.canInitParallax;
    Jarallax.prototype.canInitParallax = function () {
        var self = this;
        var defaultResult = defCanInitParallax.apply(self);

        if (!self.options.videoSrc) {
            return defaultResult;
        }

        var video = new _videoWorker2.default(self.options.videoSrc, {
            autoplay: true,
            loop: true,
            showContols: false,
            startTime: self.options.videoStartTime || 0,
            endTime: self.options.videoEndTime || 0,
            mute: self.options.videoVolume ? 0 : 1,
            volume: self.options.videoVolume || 0
        });

        if (video.isValid()) {
            // if parallax will not be inited, we can add thumbnail on background.
            if (!defaultResult) {
                if (!self.defaultInitImgResult) {
                    video.getImageURL(function (url) {
                        // save default user styles
                        var curStyle = self.$item.getAttribute('style');
                        if (curStyle) {
                            self.$item.setAttribute('data-jarallax-original-styles', curStyle);
                        }

                        // set new background
                        self.css(self.$item, {
                            'background-image': 'url("' + url + '")',
                            'background-position': 'center',
                            'background-size': 'cover'
                        });
                    });
                }

                // init video
            } else {
                video.on('ready', function () {
                    if (self.options.videoPlayOnlyVisible) {
                        var oldOnScroll = self.onScroll;
                        self.onScroll = function () {
                            oldOnScroll.apply(self);
                            if (self.isVisible()) {
                                video.play();
                            } else {
                                video.pause();
                            }
                        };
                    } else {
                        video.play();
                    }
                });

                video.on('started', function () {
                    self.image.$default_item = self.image.$item;
                    self.image.$item = self.$video;

                    // set video width and height
                    self.image.width = self.video.videoWidth || 1280;
                    self.image.height = self.video.videoHeight || 720;
                    self.options.imgWidth = self.image.width;
                    self.options.imgHeight = self.image.height;
                    self.coverImage();
                    self.clipContainer();
                    self.onScroll();

                    // hide image
                    if (self.image.$default_item) {
                        self.image.$default_item.style.display = 'none';
                    }
                });

                self.video = video;

                // set image if not exists
                if (!self.defaultInitImgResult) {
                    if (video.type !== 'local') {
                        video.getImageURL(function (url) {
                            self.image.src = url;
                            self.init();
                        });

                        return false;
                    }

                    // set empty image on local video if not defined
                    self.image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    return true;
                }
            }
        }

        return defaultResult;
    };

    // Destroy video parallax
    var defDestroy = Jarallax.prototype.destroy;
    Jarallax.prototype.destroy = function () {
        var self = this;

        if (self.image.$default_item) {
            self.image.$item = self.image.$default_item;
            delete self.image.$default_item;
        }

        defDestroy.apply(self);
    };
}

/***/ })
/******/ ]);

/*!
 * Name    : Elements Extension for Jarallax
 * Version : 1.0.0
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/jarallax
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

    "use strict";
    /* WEBPACK VAR INJECTION */(function(global) {
    
    var win;
    
    if (typeof window !== "undefined") {
        win = window;
    } else if (typeof global !== "undefined") {
        win = global;
    } else if (typeof self !== "undefined") {
        win = self;
    } else {
        win = {};
    }
    
    module.exports = win;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    module.exports = function (callback) {
    
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // Already ready or interactive, execute callback
            callback.call();
        } else if (document.attachEvent) {
            // Old browsers
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState === 'interactive') callback.call();
            });
        } else if (document.addEventListener) {
            // Modern browsers
            document.addEventListener('DOMContentLoaded', callback);
        }
    };
    
    /***/ }),
    /* 2 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var g;
    
    // This works in non-strict mode
    g = function () {
        return this;
    }();
    
    try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1, eval)("this");
    } catch (e) {
        // This works if the window reference is available
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
    }
    
    // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}
    
    module.exports = g;
    
    /***/ }),
    /* 3 */,
    /* 4 */
    /***/ (function(module, exports, __webpack_require__) {
    
    module.exports = __webpack_require__(5);
    
    
    /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var _liteReady = __webpack_require__(1);
    
    var _liteReady2 = _interopRequireDefault(_liteReady);
    
    var _jarallaxElement = __webpack_require__(6);
    
    var _jarallaxElement2 = _interopRequireDefault(_jarallaxElement);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    (0, _jarallaxElement2.default)();
    
    // data-jarallax-element initialization
    (0, _liteReady2.default)(function () {
        if (typeof jarallax !== 'undefined') {
            jarallax(document.querySelectorAll('[data-jarallax-element]'));
        }
    });
    
    /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = jarallaxElement;
    
    var _global = __webpack_require__(0);
    
    var _global2 = _interopRequireDefault(_global);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function jarallaxElement() {
        var jarallax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _global2.default.jarallax;
    
        if (typeof jarallax === 'undefined') {
            return;
        }
    
        var Jarallax = jarallax.constructor;
    
        // redefine default methods
        ['initImg', 'canInitParallax', 'init', 'destroy', 'clipContainer', 'coverImage', 'isVisible', 'onScroll', 'onResize'].forEach(function (key) {
            var def = Jarallax.prototype[key];
            Jarallax.prototype[key] = function () {
                var self = this;
                var args = arguments || [];
    
                if (key === 'initImg' && self.$item.getAttribute('data-jarallax-element') !== null) {
                    self.options.type = 'element';
                    self.pureOptions.speed = self.$item.getAttribute('data-jarallax-element') || self.pureOptions.speed;
                }
                if (self.options.type !== 'element') {
                    return def.apply(self, args);
                }
    
                self.pureOptions.threshold = self.$item.getAttribute('data-threshold') || '';
    
                switch (key) {
                    case 'init':
                        var speedArr = self.pureOptions.speed.split(' ');
                        self.options.speed = self.pureOptions.speed || 0;
                        self.options.speedY = speedArr[0] ? parseFloat(speedArr[0]) : 0;
                        self.options.speedX = speedArr[1] ? parseFloat(speedArr[1]) : 0;
    
                        var thresholdArr = self.pureOptions.threshold.split(' ');
                        self.options.thresholdY = thresholdArr[0] ? parseFloat(thresholdArr[0]) : null;
                        self.options.thresholdX = thresholdArr[1] ? parseFloat(thresholdArr[1]) : null;
    
                        self.onResize();
                        self.onScroll();
                        self.addToParallaxList();
                        break;
                    case 'onResize':
                        var defTransform = self.css(self.$item, 'transform');
                        self.css(self.$item, { transform: '' });
                        var rect = self.$item.getBoundingClientRect();
                        self.itemData = {
                            width: rect.width,
                            height: rect.height,
                            y: rect.top + self.getWindowData().y,
                            x: rect.left
                        };
                        self.css(self.$item, { transform: defTransform });
                        break;
                    case 'onScroll':
                        var wnd = self.getWindowData();
                        var centerPercent = (wnd.y + wnd.height / 2 - self.itemData.y - self.itemData.height / 2) / (wnd.height / 2);
                        var moveY = centerPercent * self.options.speedY;
                        var moveX = centerPercent * self.options.speedX;
                        var my = moveY;
                        var mx = moveX;
                        if (self.options.thresholdY !== null && moveY > self.options.thresholdY) my = 0;
                        if (self.options.thresholdX !== null && moveX > self.options.thresholdX) mx = 0;
                        self.css(self.$item, { transform: 'translate3d(' + mx + 'px,' + my + 'px,0)' });
                        break;
                    case 'initImg':
                    case 'isVisible':
                    case 'clipContainer':
                    case 'coverImage':
                        return true;
                    // no default
                }
                return def.apply(self, args);
            };
        });
    } /* eslint no-case-declarations: "off" */
    
    /***/ })
    /******/ ]);
/* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"undefined"!=typeof module&&module.exports?module.exports=e:e(jQuery,window,document)}(function(e){!function(t){var o="function"==typeof define&&define.amd,a="undefined"!=typeof module&&module.exports,n="https:"==document.location.protocol?"https:":"http:",i="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";o||(a?require("jquery-mousewheel")(e):e.event.special.mousewheel||e("head").append(decodeURI("%3Cscript src="+n+"//"+i+"%3E%3C/script%3E"))),t()}(function(){var t,o="mCustomScrollbar",a="mCS",n=".mCustomScrollbar",i={setTop:0,setLeft:0,axis:"y",scrollbarPosition:"inside",scrollInertia:950,autoDraggerLength:!0,alwaysShowScrollbar:0,snapOffset:0,mouseWheel:{enable:!0,scrollAmount:"auto",axis:"y",deltaFactor:"auto",disableOver:["select","option","keygen","datalist","textarea"]},scrollButtons:{scrollType:"stepless",scrollAmount:"auto"},keyboard:{enable:!0,scrollType:"stepless",scrollAmount:"auto"},contentTouchScroll:25,documentTouchScroll:!0,advanced:{autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",updateOnContentResize:!0,updateOnImageLoad:"auto",autoUpdateTimeout:60},theme:"light",callbacks:{onTotalScrollOffset:0,onTotalScrollBackOffset:0,alwaysTriggerOffsets:!0}},r=0,l={},s=window.attachEvent&&!window.addEventListener?1:0,c=!1,d=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar","mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer","mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"],u={init:function(t){var t=e.extend(!0,{},i,t),o=f.call(this);if(t.live){var s=t.liveSelector||this.selector||n,c=e(s);if("off"===t.live)return void m(s);l[s]=setTimeout(function(){c.mCustomScrollbar(t),"once"===t.live&&c.length&&m(s)},500)}else m(s);return t.setWidth=t.set_width?t.set_width:t.setWidth,t.setHeight=t.set_height?t.set_height:t.setHeight,t.axis=t.horizontalScroll?"x":p(t.axis),t.scrollInertia=t.scrollInertia>0&&t.scrollInertia<17?17:t.scrollInertia,"object"!=typeof t.mouseWheel&&1==t.mouseWheel&&(t.mouseWheel={enable:!0,scrollAmount:"auto",axis:"y",preventDefault:!1,deltaFactor:"auto",normalizeDelta:!1,invert:!1}),t.mouseWheel.scrollAmount=t.mouseWheelPixels?t.mouseWheelPixels:t.mouseWheel.scrollAmount,t.mouseWheel.normalizeDelta=t.advanced.normalizeMouseWheelDelta?t.advanced.normalizeMouseWheelDelta:t.mouseWheel.normalizeDelta,t.scrollButtons.scrollType=g(t.scrollButtons.scrollType),h(t),e(o).each(function(){var o=e(this);if(!o.data(a)){o.data(a,{idx:++r,opt:t,scrollRatio:{y:null,x:null},overflowed:null,contentReset:{y:null,x:null},bindEvents:!1,tweenRunning:!1,sequential:{},langDir:o.css("direction"),cbOffsets:null,trigger:null,poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}});var n=o.data(a),i=n.opt,l=o.data("mcs-axis"),s=o.data("mcs-scrollbar-position"),c=o.data("mcs-theme");l&&(i.axis=l),s&&(i.scrollbarPosition=s),c&&(i.theme=c,h(i)),v.call(this),n&&i.callbacks.onCreate&&"function"==typeof i.callbacks.onCreate&&i.callbacks.onCreate.call(this),e("#mCSB_"+n.idx+"_container img:not(."+d[2]+")").addClass(d[2]),u.update.call(null,o)}})},update:function(t,o){var n=t||f.call(this);return e(n).each(function(){var t=e(this);if(t.data(a)){var n=t.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container"),l=e("#mCSB_"+n.idx),s=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];if(!r.length)return;n.tweenRunning&&Q(t),o&&n&&i.callbacks.onBeforeUpdate&&"function"==typeof i.callbacks.onBeforeUpdate&&i.callbacks.onBeforeUpdate.call(this),t.hasClass(d[3])&&t.removeClass(d[3]),t.hasClass(d[4])&&t.removeClass(d[4]),l.css("max-height","none"),l.height()!==t.height()&&l.css("max-height",t.height()),_.call(this),"y"===i.axis||i.advanced.autoExpandHorizontalScroll||r.css("width",x(r)),n.overflowed=y.call(this),M.call(this),i.autoDraggerLength&&S.call(this),b.call(this),T.call(this);var c=[Math.abs(r[0].offsetTop),Math.abs(r[0].offsetLeft)];"x"!==i.axis&&(n.overflowed[0]?s[0].height()>s[0].parent().height()?B.call(this):(G(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}),n.contentReset.y=null):(B.call(this),"y"===i.axis?k.call(this):"yx"===i.axis&&n.overflowed[1]&&G(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}))),"y"!==i.axis&&(n.overflowed[1]?s[1].width()>s[1].parent().width()?B.call(this):(G(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}),n.contentReset.x=null):(B.call(this),"x"===i.axis?k.call(this):"yx"===i.axis&&n.overflowed[0]&&G(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}))),o&&n&&(2===o&&i.callbacks.onImageLoad&&"function"==typeof i.callbacks.onImageLoad?i.callbacks.onImageLoad.call(this):3===o&&i.callbacks.onSelectorChange&&"function"==typeof i.callbacks.onSelectorChange?i.callbacks.onSelectorChange.call(this):i.callbacks.onUpdate&&"function"==typeof i.callbacks.onUpdate&&i.callbacks.onUpdate.call(this)),N.call(this)}})},scrollTo:function(t,o){if("undefined"!=typeof t&&null!=t){var n=f.call(this);return e(n).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l={trigger:"external",scrollInertia:r.scrollInertia,scrollEasing:"mcsEaseInOut",moveDragger:!1,timeout:60,callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},s=e.extend(!0,{},l,o),c=Y.call(this,t),d=s.scrollInertia>0&&s.scrollInertia<17?17:s.scrollInertia;c[0]=X.call(this,c[0],"y"),c[1]=X.call(this,c[1],"x"),s.moveDragger&&(c[0]*=i.scrollRatio.y,c[1]*=i.scrollRatio.x),s.dur=ne()?0:d,setTimeout(function(){null!==c[0]&&"undefined"!=typeof c[0]&&"x"!==r.axis&&i.overflowed[0]&&(s.dir="y",s.overwrite="all",G(n,c[0].toString(),s)),null!==c[1]&&"undefined"!=typeof c[1]&&"y"!==r.axis&&i.overflowed[1]&&(s.dir="x",s.overwrite="none",G(n,c[1].toString(),s))},s.timeout)}})}},stop:function(){var t=f.call(this);return e(t).each(function(){var t=e(this);t.data(a)&&Q(t)})},disable:function(t){var o=f.call(this);return e(o).each(function(){var o=e(this);if(o.data(a)){o.data(a);N.call(this,"remove"),k.call(this),t&&B.call(this),M.call(this,!0),o.addClass(d[3])}})},destroy:function(){var t=f.call(this);return e(t).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx),s=e("#mCSB_"+i.idx+"_container"),c=e(".mCSB_"+i.idx+"_scrollbar");r.live&&m(r.liveSelector||e(t).selector),N.call(this,"remove"),k.call(this),B.call(this),n.removeData(a),$(this,"mcs"),c.remove(),s.find("img."+d[2]).removeClass(d[2]),l.replaceWith(s.contents()),n.removeClass(o+" _"+a+"_"+i.idx+" "+d[6]+" "+d[7]+" "+d[5]+" "+d[3]).addClass(d[4])}})}},f=function(){return"object"!=typeof e(this)||e(this).length<1?n:this},h=function(t){var o=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],a=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],n=["minimal","minimal-dark"],i=["minimal","minimal-dark"],r=["minimal","minimal-dark"];t.autoDraggerLength=e.inArray(t.theme,o)>-1?!1:t.autoDraggerLength,t.autoExpandScrollbar=e.inArray(t.theme,a)>-1?!1:t.autoExpandScrollbar,t.scrollButtons.enable=e.inArray(t.theme,n)>-1?!1:t.scrollButtons.enable,t.autoHideScrollbar=e.inArray(t.theme,i)>-1?!0:t.autoHideScrollbar,t.scrollbarPosition=e.inArray(t.theme,r)>-1?"outside":t.scrollbarPosition},m=function(e){l[e]&&(clearTimeout(l[e]),$(l,e))},p=function(e){return"yx"===e||"xy"===e||"auto"===e?"yx":"x"===e||"horizontal"===e?"x":"y"},g=function(e){return"stepped"===e||"pixels"===e||"step"===e||"click"===e?"stepped":"stepless"},v=function(){var t=e(this),n=t.data(a),i=n.opt,r=i.autoExpandScrollbar?" "+d[1]+"_expand":"",l=["<div id='mCSB_"+n.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_vertical"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+n.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_horizontal"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],s="yx"===i.axis?"mCSB_vertical_horizontal":"x"===i.axis?"mCSB_horizontal":"mCSB_vertical",c="yx"===i.axis?l[0]+l[1]:"x"===i.axis?l[1]:l[0],u="yx"===i.axis?"<div id='mCSB_"+n.idx+"_container_wrapper' class='mCSB_container_wrapper' />":"",f=i.autoHideScrollbar?" "+d[6]:"",h="x"!==i.axis&&"rtl"===n.langDir?" "+d[7]:"";i.setWidth&&t.css("width",i.setWidth),i.setHeight&&t.css("height",i.setHeight),i.setLeft="y"!==i.axis&&"rtl"===n.langDir?"989999px":i.setLeft,t.addClass(o+" _"+a+"_"+n.idx+f+h).wrapInner("<div id='mCSB_"+n.idx+"' class='mCustomScrollBox mCS-"+i.theme+" "+s+"'><div id='mCSB_"+n.idx+"_container' class='mCSB_container' style='position:relative; top:"+i.setTop+"; left:"+i.setLeft+";' dir='"+n.langDir+"' /></div>");var m=e("#mCSB_"+n.idx),p=e("#mCSB_"+n.idx+"_container");"y"===i.axis||i.advanced.autoExpandHorizontalScroll||p.css("width",x(p)),"outside"===i.scrollbarPosition?("static"===t.css("position")&&t.css("position","relative"),t.css("overflow","visible"),m.addClass("mCSB_outside").after(c)):(m.addClass("mCSB_inside").append(c),p.wrap(u)),w.call(this);var g=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];g[0].css("min-height",g[0].height()),g[1].css("min-width",g[1].width())},x=function(t){var o=[t[0].scrollWidth,Math.max.apply(Math,t.children().map(function(){return e(this).outerWidth(!0)}).get())],a=t.parent().width();return o[0]>a?o[0]:o[1]>a?o[1]:"100%"},_=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx+"_container");if(n.advanced.autoExpandHorizontalScroll&&"y"!==n.axis){i.css({width:"auto","min-width":0,"overflow-x":"scroll"});var r=Math.ceil(i[0].scrollWidth);3===n.advanced.autoExpandHorizontalScroll||2!==n.advanced.autoExpandHorizontalScroll&&r>i.parent().width()?i.css({width:r,"min-width":"100%","overflow-x":"inherit"}):i.css({"overflow-x":"inherit",position:"absolute"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:Math.ceil(i[0].getBoundingClientRect().right+.4)-Math.floor(i[0].getBoundingClientRect().left),"min-width":"100%",position:"relative"}).unwrap()}},w=function(){var t=e(this),o=t.data(a),n=o.opt,i=e(".mCSB_"+o.idx+"_scrollbar:first"),r=oe(n.scrollButtons.tabindex)?"tabindex='"+n.scrollButtons.tabindex+"'":"",l=["<a href='#' class='"+d[13]+"' "+r+" />","<a href='#' class='"+d[14]+"' "+r+" />","<a href='#' class='"+d[15]+"' "+r+" />","<a href='#' class='"+d[16]+"' "+r+" />"],s=["x"===n.axis?l[2]:l[0],"x"===n.axis?l[3]:l[1],l[2],l[3]];n.scrollButtons.enable&&i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])},S=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[n.height()/i.outerHeight(!1),n.width()/i.outerWidth(!1)],c=[parseInt(r[0].css("min-height")),Math.round(l[0]*r[0].parent().height()),parseInt(r[1].css("min-width")),Math.round(l[1]*r[1].parent().width())],d=s&&c[1]<c[0]?c[0]:c[1],u=s&&c[3]<c[2]?c[2]:c[3];r[0].css({height:d,"max-height":r[0].parent().height()-10}).find(".mCSB_dragger_bar").css({"line-height":c[0]+"px"}),r[1].css({width:u,"max-width":r[1].parent().width()-10})},b=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[i.outerHeight(!1)-n.height(),i.outerWidth(!1)-n.width()],s=[l[0]/(r[0].parent().height()-r[0].height()),l[1]/(r[1].parent().width()-r[1].width())];o.scrollRatio={y:s[0],x:s[1]}},C=function(e,t,o){var a=o?d[0]+"_expanded":"",n=e.closest(".mCSB_scrollTools");"active"===t?(e.toggleClass(d[0]+" "+a),n.toggleClass(d[1]),e[0]._draggable=e[0]._draggable?0:1):e[0]._draggable||("hide"===t?(e.removeClass(d[0]),n.removeClass(d[1])):(e.addClass(d[0]),n.addClass(d[1])))},y=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=null==o.overflowed?i.height():i.outerHeight(!1),l=null==o.overflowed?i.width():i.outerWidth(!1),s=i[0].scrollHeight,c=i[0].scrollWidth;return s>r&&(r=s),c>l&&(l=c),[r>n.height(),l>n.width()]},B=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx),r=e("#mCSB_"+o.idx+"_container"),l=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")];if(Q(t),("x"!==n.axis&&!o.overflowed[0]||"y"===n.axis&&o.overflowed[0])&&(l[0].add(r).css("top",0),G(t,"_resetY")),"y"!==n.axis&&!o.overflowed[1]||"x"===n.axis&&o.overflowed[1]){var s=dx=0;"rtl"===o.langDir&&(s=i.width()-r.outerWidth(!1),dx=Math.abs(s/o.scrollRatio.x)),r.css("left",s),l[1].css("left",dx),G(t,"_resetX")}},T=function(){function t(){r=setTimeout(function(){e.event.special.mousewheel?(clearTimeout(r),W.call(o[0])):t()},100)}var o=e(this),n=o.data(a),i=n.opt;if(!n.bindEvents){if(I.call(this),i.contentTouchScroll&&D.call(this),E.call(this),i.mouseWheel.enable){var r;t()}P.call(this),U.call(this),i.advanced.autoScrollOnFocus&&H.call(this),i.scrollButtons.enable&&F.call(this),i.keyboard.enable&&q.call(this),n.bindEvents=!0}},k=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=".mCSB_"+o.idx+"_scrollbar",l=e("#mCSB_"+o.idx+",#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,"+r+" ."+d[12]+",#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal,"+r+">a"),s=e("#mCSB_"+o.idx+"_container");n.advanced.releaseDraggableSelectors&&l.add(e(n.advanced.releaseDraggableSelectors)),n.advanced.extraDraggableSelectors&&l.add(e(n.advanced.extraDraggableSelectors)),o.bindEvents&&(e(document).add(e(!A()||top.document)).unbind("."+i),l.each(function(){e(this).unbind("."+i)}),clearTimeout(t[0]._focusTimeout),$(t[0],"_focusTimeout"),clearTimeout(o.sequential.step),$(o.sequential,"step"),clearTimeout(s[0].onCompleteTimeout),$(s[0],"onCompleteTimeout"),o.bindEvents=!1)},M=function(t){var o=e(this),n=o.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container_wrapper"),l=r.length?r:e("#mCSB_"+n.idx+"_container"),s=[e("#mCSB_"+n.idx+"_scrollbar_vertical"),e("#mCSB_"+n.idx+"_scrollbar_horizontal")],c=[s[0].find(".mCSB_dragger"),s[1].find(".mCSB_dragger")];"x"!==i.axis&&(n.overflowed[0]&&!t?(s[0].add(c[0]).add(s[0].children("a")).css("display","block"),l.removeClass(d[8]+" "+d[10])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[0].css("display","none"),l.removeClass(d[10])):(s[0].css("display","none"),l.addClass(d[10])),l.addClass(d[8]))),"y"!==i.axis&&(n.overflowed[1]&&!t?(s[1].add(c[1]).add(s[1].children("a")).css("display","block"),l.removeClass(d[9]+" "+d[11])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[1].css("display","none"),l.removeClass(d[11])):(s[1].css("display","none"),l.addClass(d[11])),l.addClass(d[9]))),n.overflowed[0]||n.overflowed[1]?o.removeClass(d[5]):o.addClass(d[5])},O=function(t){var o=t.type,a=t.target.ownerDocument!==document&&null!==frameElement?[e(frameElement).offset().top,e(frameElement).offset().left]:null,n=A()&&t.target.ownerDocument!==top.document&&null!==frameElement?[e(t.view.frameElement).offset().top,e(t.view.frameElement).offset().left]:[0,0];switch(o){case"pointerdown":case"MSPointerDown":case"pointermove":case"MSPointerMove":case"pointerup":case"MSPointerUp":return a?[t.originalEvent.pageY-a[0]+n[0],t.originalEvent.pageX-a[1]+n[1],!1]:[t.originalEvent.pageY,t.originalEvent.pageX,!1];case"touchstart":case"touchmove":case"touchend":var i=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],r=t.originalEvent.touches.length||t.originalEvent.changedTouches.length;return t.target.ownerDocument!==document?[i.screenY,i.screenX,r>1]:[i.pageY,i.pageX,r>1];default:return a?[t.pageY-a[0]+n[0],t.pageX-a[1]+n[1],!1]:[t.pageY,t.pageX,!1]}},I=function(){function t(e,t,a,n){if(h[0].idleTimer=d.scrollInertia<233?250:0,o.attr("id")===f[1])var i="x",s=(o[0].offsetLeft-t+n)*l.scrollRatio.x;else var i="y",s=(o[0].offsetTop-e+a)*l.scrollRatio.y;G(r,s.toString(),{dir:i,drag:!0})}var o,n,i,r=e(this),l=r.data(a),d=l.opt,u=a+"_"+l.idx,f=["mCSB_"+l.idx+"_dragger_vertical","mCSB_"+l.idx+"_dragger_horizontal"],h=e("#mCSB_"+l.idx+"_container"),m=e("#"+f[0]+",#"+f[1]),p=d.advanced.releaseDraggableSelectors?m.add(e(d.advanced.releaseDraggableSelectors)):m,g=d.advanced.extraDraggableSelectors?e(!A()||top.document).add(e(d.advanced.extraDraggableSelectors)):e(!A()||top.document);m.bind("contextmenu."+u,function(e){e.preventDefault()}).bind("mousedown."+u+" touchstart."+u+" pointerdown."+u+" MSPointerDown."+u,function(t){if(t.stopImmediatePropagation(),t.preventDefault(),ee(t)){c=!0,s&&(document.onselectstart=function(){return!1}),L.call(h,!1),Q(r),o=e(this);var a=o.offset(),l=O(t)[0]-a.top,u=O(t)[1]-a.left,f=o.height()+a.top,m=o.width()+a.left;f>l&&l>0&&m>u&&u>0&&(n=l,i=u),C(o,"active",d.autoExpandScrollbar)}}).bind("touchmove."+u,function(e){e.stopImmediatePropagation(),e.preventDefault();var a=o.offset(),r=O(e)[0]-a.top,l=O(e)[1]-a.left;t(n,i,r,l)}),e(document).add(g).bind("mousemove."+u+" pointermove."+u+" MSPointerMove."+u,function(e){if(o){var a=o.offset(),r=O(e)[0]-a.top,l=O(e)[1]-a.left;if(n===r&&i===l)return;t(n,i,r,l)}}).add(p).bind("mouseup."+u+" touchend."+u+" pointerup."+u+" MSPointerUp."+u,function(){o&&(C(o,"active",d.autoExpandScrollbar),o=null),c=!1,s&&(document.onselectstart=null),L.call(h,!0)})},D=function(){function o(e){if(!te(e)||c||O(e)[2])return void(t=0);t=1,b=0,C=0,d=1,y.removeClass("mCS_touch_action");var o=I.offset();u=O(e)[0]-o.top,f=O(e)[1]-o.left,z=[O(e)[0],O(e)[1]]}function n(e){if(te(e)&&!c&&!O(e)[2]&&(T.documentTouchScroll||e.preventDefault(),e.stopImmediatePropagation(),(!C||b)&&d)){g=K();var t=M.offset(),o=O(e)[0]-t.top,a=O(e)[1]-t.left,n="mcsLinearOut";if(E.push(o),W.push(a),z[2]=Math.abs(O(e)[0]-z[0]),z[3]=Math.abs(O(e)[1]-z[1]),B.overflowed[0])var i=D[0].parent().height()-D[0].height(),r=u-o>0&&o-u>-(i*B.scrollRatio.y)&&(2*z[3]<z[2]||"yx"===T.axis);if(B.overflowed[1])var l=D[1].parent().width()-D[1].width(),h=f-a>0&&a-f>-(l*B.scrollRatio.x)&&(2*z[2]<z[3]||"yx"===T.axis);r||h?(U||e.preventDefault(),b=1):(C=1,y.addClass("mCS_touch_action")),U&&e.preventDefault(),w="yx"===T.axis?[u-o,f-a]:"x"===T.axis?[null,f-a]:[u-o,null],I[0].idleTimer=250,B.overflowed[0]&&s(w[0],R,n,"y","all",!0),B.overflowed[1]&&s(w[1],R,n,"x",L,!0)}}function i(e){if(!te(e)||c||O(e)[2])return void(t=0);t=1,e.stopImmediatePropagation(),Q(y),p=K();var o=M.offset();h=O(e)[0]-o.top,m=O(e)[1]-o.left,E=[],W=[]}function r(e){if(te(e)&&!c&&!O(e)[2]){d=0,e.stopImmediatePropagation(),b=0,C=0,v=K();var t=M.offset(),o=O(e)[0]-t.top,a=O(e)[1]-t.left;if(!(v-g>30)){_=1e3/(v-p);var n="mcsEaseOut",i=2.5>_,r=i?[E[E.length-2],W[W.length-2]]:[0,0];x=i?[o-r[0],a-r[1]]:[o-h,a-m];var u=[Math.abs(x[0]),Math.abs(x[1])];_=i?[Math.abs(x[0]/4),Math.abs(x[1]/4)]:[_,_];var f=[Math.abs(I[0].offsetTop)-x[0]*l(u[0]/_[0],_[0]),Math.abs(I[0].offsetLeft)-x[1]*l(u[1]/_[1],_[1])];w="yx"===T.axis?[f[0],f[1]]:"x"===T.axis?[null,f[1]]:[f[0],null],S=[4*u[0]+T.scrollInertia,4*u[1]+T.scrollInertia];var y=parseInt(T.contentTouchScroll)||0;w[0]=u[0]>y?w[0]:0,w[1]=u[1]>y?w[1]:0,B.overflowed[0]&&s(w[0],S[0],n,"y",L,!1),B.overflowed[1]&&s(w[1],S[1],n,"x",L,!1)}}}function l(e,t){var o=[1.5*t,2*t,t/1.5,t/2];return e>90?t>4?o[0]:o[3]:e>60?t>3?o[3]:o[2]:e>30?t>8?o[1]:t>6?o[0]:t>4?t:o[2]:t>8?t:o[3]}function s(e,t,o,a,n,i){e&&G(y,e.toString(),{dur:t,scrollEasing:o,dir:a,overwrite:n,drag:i})}var d,u,f,h,m,p,g,v,x,_,w,S,b,C,y=e(this),B=y.data(a),T=B.opt,k=a+"_"+B.idx,M=e("#mCSB_"+B.idx),I=e("#mCSB_"+B.idx+"_container"),D=[e("#mCSB_"+B.idx+"_dragger_vertical"),e("#mCSB_"+B.idx+"_dragger_horizontal")],E=[],W=[],R=0,L="yx"===T.axis?"none":"all",z=[],P=I.find("iframe"),H=["touchstart."+k+" pointerdown."+k+" MSPointerDown."+k,"touchmove."+k+" pointermove."+k+" MSPointerMove."+k,"touchend."+k+" pointerup."+k+" MSPointerUp."+k],U=void 0!==document.body.style.touchAction&&""!==document.body.style.touchAction;I.bind(H[0],function(e){o(e)}).bind(H[1],function(e){n(e)}),M.bind(H[0],function(e){i(e)}).bind(H[2],function(e){r(e)}),P.length&&P.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind(H[0],function(e){o(e),i(e)}).bind(H[1],function(e){n(e)}).bind(H[2],function(e){r(e)})})})},E=function(){function o(){return window.getSelection?window.getSelection().toString():document.selection&&"Control"!=document.selection.type?document.selection.createRange().text:0}function n(e,t,o){d.type=o&&i?"stepped":"stepless",d.scrollAmount=10,j(r,e,t,"mcsLinearOut",o?60:null)}var i,r=e(this),l=r.data(a),s=l.opt,d=l.sequential,u=a+"_"+l.idx,f=e("#mCSB_"+l.idx+"_container"),h=f.parent();f.bind("mousedown."+u,function(){t||i||(i=1,c=!0)}).add(document).bind("mousemove."+u,function(e){if(!t&&i&&o()){var a=f.offset(),r=O(e)[0]-a.top+f[0].offsetTop,c=O(e)[1]-a.left+f[0].offsetLeft;r>0&&r<h.height()&&c>0&&c<h.width()?d.step&&n("off",null,"stepped"):("x"!==s.axis&&l.overflowed[0]&&(0>r?n("on",38):r>h.height()&&n("on",40)),"y"!==s.axis&&l.overflowed[1]&&(0>c?n("on",37):c>h.width()&&n("on",39)))}}).bind("mouseup."+u+" dragend."+u,function(){t||(i&&(i=0,n("off",null)),c=!1)})},W=function(){function t(t,a){if(Q(o),!z(o,t.target)){var r="auto"!==i.mouseWheel.deltaFactor?parseInt(i.mouseWheel.deltaFactor):s&&t.deltaFactor<100?100:t.deltaFactor||100,d=i.scrollInertia;if("x"===i.axis||"x"===i.mouseWheel.axis)var u="x",f=[Math.round(r*n.scrollRatio.x),parseInt(i.mouseWheel.scrollAmount)],h="auto"!==i.mouseWheel.scrollAmount?f[1]:f[0]>=l.width()?.9*l.width():f[0],m=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetLeft),p=c[1][0].offsetLeft,g=c[1].parent().width()-c[1].width(),v="y"===i.mouseWheel.axis?t.deltaY||a:t.deltaX;else var u="y",f=[Math.round(r*n.scrollRatio.y),parseInt(i.mouseWheel.scrollAmount)],h="auto"!==i.mouseWheel.scrollAmount?f[1]:f[0]>=l.height()?.9*l.height():f[0],m=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetTop),p=c[0][0].offsetTop,g=c[0].parent().height()-c[0].height(),v=t.deltaY||a;"y"===u&&!n.overflowed[0]||"x"===u&&!n.overflowed[1]||((i.mouseWheel.invert||t.webkitDirectionInvertedFromDevice)&&(v=-v),i.mouseWheel.normalizeDelta&&(v=0>v?-1:1),(v>0&&0!==p||0>v&&p!==g||i.mouseWheel.preventDefault)&&(t.stopImmediatePropagation(),t.preventDefault()),t.deltaFactor<5&&!i.mouseWheel.normalizeDelta&&(h=t.deltaFactor,d=17),G(o,(m-v*h).toString(),{dir:u,dur:d}))}}if(e(this).data(a)){var o=e(this),n=o.data(a),i=n.opt,r=a+"_"+n.idx,l=e("#mCSB_"+n.idx),c=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")],d=e("#mCSB_"+n.idx+"_container").find("iframe");d.length&&d.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind("mousewheel."+r,function(e,o){t(e,o)})})}),l.bind("mousewheel."+r,function(e,o){t(e,o)})}},R=new Object,A=function(t){var o=!1,a=!1,n=null;if(void 0===t?a="#empty":void 0!==e(t).attr("id")&&(a=e(t).attr("id")),a!==!1&&void 0!==R[a])return R[a];if(t){try{var i=t.contentDocument||t.contentWindow.document;n=i.body.innerHTML}catch(r){}o=null!==n}else{try{var i=top.document;n=i.body.innerHTML}catch(r){}o=null!==n}return a!==!1&&(R[a]=o),o},L=function(e){var t=this.find("iframe");if(t.length){var o=e?"auto":"none";t.css("pointer-events",o)}},z=function(t,o){var n=o.nodeName.toLowerCase(),i=t.data(a).opt.mouseWheel.disableOver,r=["select","textarea"];return e.inArray(n,i)>-1&&!(e.inArray(n,r)>-1&&!e(o).is(":focus"))},P=function(){var t,o=e(this),n=o.data(a),i=a+"_"+n.idx,r=e("#mCSB_"+n.idx+"_container"),l=r.parent(),s=e(".mCSB_"+n.idx+"_scrollbar ."+d[12]);s.bind("mousedown."+i+" touchstart."+i+" pointerdown."+i+" MSPointerDown."+i,function(o){c=!0,e(o.target).hasClass("mCSB_dragger")||(t=1)}).bind("touchend."+i+" pointerup."+i+" MSPointerUp."+i,function(){c=!1}).bind("click."+i,function(a){if(t&&(t=0,e(a.target).hasClass(d[12])||e(a.target).hasClass("mCSB_draggerRail"))){Q(o);var i=e(this),s=i.find(".mCSB_dragger");if(i.parent(".mCSB_scrollTools_horizontal").length>0){if(!n.overflowed[1])return;var c="x",u=a.pageX>s.offset().left?-1:1,f=Math.abs(r[0].offsetLeft)-u*(.9*l.width())}else{if(!n.overflowed[0])return;var c="y",u=a.pageY>s.offset().top?-1:1,f=Math.abs(r[0].offsetTop)-u*(.9*l.height())}G(o,f.toString(),{dir:c,scrollEasing:"mcsEaseInOut"})}})},H=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=e("#mCSB_"+o.idx+"_container"),l=r.parent();r.bind("focusin."+i,function(){var o=e(document.activeElement),a=r.find(".mCustomScrollBox").length,i=0;o.is(n.advanced.autoScrollOnFocus)&&(Q(t),clearTimeout(t[0]._focusTimeout),t[0]._focusTimer=a?(i+17)*a:0,t[0]._focusTimeout=setTimeout(function(){var e=[ae(o)[0],ae(o)[1]],a=[r[0].offsetTop,r[0].offsetLeft],s=[a[0]+e[0]>=0&&a[0]+e[0]<l.height()-o.outerHeight(!1),a[1]+e[1]>=0&&a[0]+e[1]<l.width()-o.outerWidth(!1)],c="yx"!==n.axis||s[0]||s[1]?"all":"none";"x"===n.axis||s[0]||G(t,e[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i}),"y"===n.axis||s[1]||G(t,e[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i})},t[0]._focusTimer))})},U=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container").parent();i.bind("scroll."+n,function(){0===i.scrollTop()&&0===i.scrollLeft()||e(".mCSB_"+o.idx+"_scrollbar").css("visibility","hidden")})},F=function(){var t=e(this),o=t.data(a),n=o.opt,i=o.sequential,r=a+"_"+o.idx,l=".mCSB_"+o.idx+"_scrollbar",s=e(l+">a");s.bind("contextmenu."+r,function(e){e.preventDefault()}).bind("mousedown."+r+" touchstart."+r+" pointerdown."+r+" MSPointerDown."+r+" mouseup."+r+" touchend."+r+" pointerup."+r+" MSPointerUp."+r+" mouseout."+r+" pointerout."+r+" MSPointerOut."+r+" click."+r,function(a){function r(e,o){i.scrollAmount=n.scrollButtons.scrollAmount,j(t,e,o)}if(a.preventDefault(),ee(a)){var l=e(this).attr("class");switch(i.type=n.scrollButtons.scrollType,a.type){case"mousedown":case"touchstart":case"pointerdown":case"MSPointerDown":if("stepped"===i.type)return;c=!0,o.tweenRunning=!1,r("on",l);break;case"mouseup":case"touchend":case"pointerup":case"MSPointerUp":case"mouseout":case"pointerout":case"MSPointerOut":if("stepped"===i.type)return;c=!1,i.dir&&r("off",l);break;case"click":if("stepped"!==i.type||o.tweenRunning)return;r("on",l)}}})},q=function(){function t(t){function a(e,t){r.type=i.keyboard.scrollType,r.scrollAmount=i.keyboard.scrollAmount,"stepped"===r.type&&n.tweenRunning||j(o,e,t)}switch(t.type){case"blur":n.tweenRunning&&r.dir&&a("off",null);break;case"keydown":case"keyup":var l=t.keyCode?t.keyCode:t.which,s="on";if("x"!==i.axis&&(38===l||40===l)||"y"!==i.axis&&(37===l||39===l)){if((38===l||40===l)&&!n.overflowed[0]||(37===l||39===l)&&!n.overflowed[1])return;"keyup"===t.type&&(s="off"),e(document.activeElement).is(u)||(t.preventDefault(),t.stopImmediatePropagation(),a(s,l))}else if(33===l||34===l){if((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type){Q(o);var f=34===l?-1:1;if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=Math.abs(c[0].offsetLeft)-f*(.9*d.width());else var h="y",m=Math.abs(c[0].offsetTop)-f*(.9*d.height());G(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}else if((35===l||36===l)&&!e(document.activeElement).is(u)&&((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type)){if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=35===l?Math.abs(d.width()-c.outerWidth(!1)):0;else var h="y",m=35===l?Math.abs(d.height()-c.outerHeight(!1)):0;G(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}}var o=e(this),n=o.data(a),i=n.opt,r=n.sequential,l=a+"_"+n.idx,s=e("#mCSB_"+n.idx),c=e("#mCSB_"+n.idx+"_container"),d=c.parent(),u="input,textarea,select,datalist,keygen,[contenteditable='true']",f=c.find("iframe"),h=["blur."+l+" keydown."+l+" keyup."+l];f.length&&f.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind(h[0],function(e){t(e)})})}),s.attr("tabindex","0").bind(h[0],function(e){t(e)})},j=function(t,o,n,i,r){function l(e){u.snapAmount&&(f.scrollAmount=u.snapAmount instanceof Array?"x"===f.dir[0]?u.snapAmount[1]:u.snapAmount[0]:u.snapAmount);var o="stepped"!==f.type,a=r?r:e?o?p/1.5:g:1e3/60,n=e?o?7.5:40:2.5,s=[Math.abs(h[0].offsetTop),Math.abs(h[0].offsetLeft)],d=[c.scrollRatio.y>10?10:c.scrollRatio.y,c.scrollRatio.x>10?10:c.scrollRatio.x],m="x"===f.dir[0]?s[1]+f.dir[1]*(d[1]*n):s[0]+f.dir[1]*(d[0]*n),v="x"===f.dir[0]?s[1]+f.dir[1]*parseInt(f.scrollAmount):s[0]+f.dir[1]*parseInt(f.scrollAmount),x="auto"!==f.scrollAmount?v:m,_=i?i:e?o?"mcsLinearOut":"mcsEaseInOut":"mcsLinear",w=!!e;return e&&17>a&&(x="x"===f.dir[0]?s[1]:s[0]),G(t,x.toString(),{dir:f.dir[0],scrollEasing:_,dur:a,onComplete:w}),e?void(f.dir=!1):(clearTimeout(f.step),void(f.step=setTimeout(function(){l()},a)))}function s(){clearTimeout(f.step),$(f,"step"),Q(t)}var c=t.data(a),u=c.opt,f=c.sequential,h=e("#mCSB_"+c.idx+"_container"),m="stepped"===f.type,p=u.scrollInertia<26?26:u.scrollInertia,g=u.scrollInertia<1?17:u.scrollInertia;switch(o){case"on":if(f.dir=[n===d[16]||n===d[15]||39===n||37===n?"x":"y",n===d[13]||n===d[15]||38===n||37===n?-1:1],Q(t),oe(n)&&"stepped"===f.type)return;l(m);break;case"off":s(),(m||c.tweenRunning&&f.dir)&&l(!0)}},Y=function(t){var o=e(this).data(a).opt,n=[];return"function"==typeof t&&(t=t()),t instanceof Array?n=t.length>1?[t[0],t[1]]:"x"===o.axis?[null,t[0]]:[t[0],null]:(n[0]=t.y?t.y:t.x||"x"===o.axis?null:t,n[1]=t.x?t.x:t.y||"y"===o.axis?null:t),"function"==typeof n[0]&&(n[0]=n[0]()),"function"==typeof n[1]&&(n[1]=n[1]()),n},X=function(t,o){if(null!=t&&"undefined"!=typeof t){var n=e(this),i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx+"_container"),s=l.parent(),c=typeof t;o||(o="x"===r.axis?"x":"y");var d="x"===o?l.outerWidth(!1)-s.width():l.outerHeight(!1)-s.height(),f="x"===o?l[0].offsetLeft:l[0].offsetTop,h="x"===o?"left":"top";switch(c){case"function":return t();case"object":var m=t.jquery?t:e(t);if(!m.length)return;return"x"===o?ae(m)[1]:ae(m)[0];case"string":case"number":if(oe(t))return Math.abs(t);if(-1!==t.indexOf("%"))return Math.abs(d*parseInt(t)/100);if(-1!==t.indexOf("-="))return Math.abs(f-parseInt(t.split("-=")[1]));if(-1!==t.indexOf("+=")){var p=f+parseInt(t.split("+=")[1]);return p>=0?0:Math.abs(p)}if(-1!==t.indexOf("px")&&oe(t.split("px")[0]))return Math.abs(t.split("px")[0]);if("top"===t||"left"===t)return 0;if("bottom"===t)return Math.abs(s.height()-l.outerHeight(!1));if("right"===t)return Math.abs(s.width()-l.outerWidth(!1));if("first"===t||"last"===t){var m=l.find(":"+t);return"x"===o?ae(m)[1]:ae(m)[0]}return e(t).length?"x"===o?ae(e(t))[1]:ae(e(t))[0]:(l.css(h,t),void u.update.call(null,n[0]))}}},N=function(t){function o(){return clearTimeout(f[0].autoUpdate),0===l.parents("html").length?void(l=null):void(f[0].autoUpdate=setTimeout(function(){return c.advanced.updateOnSelectorChange&&(s.poll.change.n=i(),s.poll.change.n!==s.poll.change.o)?(s.poll.change.o=s.poll.change.n,void r(3)):c.advanced.updateOnContentResize&&(s.poll.size.n=l[0].scrollHeight+l[0].scrollWidth+f[0].offsetHeight+l[0].offsetHeight+l[0].offsetWidth,s.poll.size.n!==s.poll.size.o)?(s.poll.size.o=s.poll.size.n,void r(1)):!c.advanced.updateOnImageLoad||"auto"===c.advanced.updateOnImageLoad&&"y"===c.axis||(s.poll.img.n=f.find("img").length,s.poll.img.n===s.poll.img.o)?void((c.advanced.updateOnSelectorChange||c.advanced.updateOnContentResize||c.advanced.updateOnImageLoad)&&o()):(s.poll.img.o=s.poll.img.n,void f.find("img").each(function(){n(this)}))},c.advanced.autoUpdateTimeout))}function n(t){function o(e,t){return function(){
return t.apply(e,arguments)}}function a(){this.onload=null,e(t).addClass(d[2]),r(2)}if(e(t).hasClass(d[2]))return void r();var n=new Image;n.onload=o(n,a),n.src=t.src}function i(){c.advanced.updateOnSelectorChange===!0&&(c.advanced.updateOnSelectorChange="*");var e=0,t=f.find(c.advanced.updateOnSelectorChange);return c.advanced.updateOnSelectorChange&&t.length>0&&t.each(function(){e+=this.offsetHeight+this.offsetWidth}),e}function r(e){clearTimeout(f[0].autoUpdate),u.update.call(null,l[0],e)}var l=e(this),s=l.data(a),c=s.opt,f=e("#mCSB_"+s.idx+"_container");return t?(clearTimeout(f[0].autoUpdate),void $(f[0],"autoUpdate")):void o()},V=function(e,t,o){return Math.round(e/t)*t-o},Q=function(t){var o=t.data(a),n=e("#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal");n.each(function(){Z.call(this)})},G=function(t,o,n){function i(e){return s&&c.callbacks[e]&&"function"==typeof c.callbacks[e]}function r(){return[c.callbacks.alwaysTriggerOffsets||w>=S[0]+y,c.callbacks.alwaysTriggerOffsets||-B>=w]}function l(){var e=[h[0].offsetTop,h[0].offsetLeft],o=[x[0].offsetTop,x[0].offsetLeft],a=[h.outerHeight(!1),h.outerWidth(!1)],i=[f.height(),f.width()];t[0].mcs={content:h,top:e[0],left:e[1],draggerTop:o[0],draggerLeft:o[1],topPct:Math.round(100*Math.abs(e[0])/(Math.abs(a[0])-i[0])),leftPct:Math.round(100*Math.abs(e[1])/(Math.abs(a[1])-i[1])),direction:n.dir}}var s=t.data(a),c=s.opt,d={trigger:"internal",dir:"y",scrollEasing:"mcsEaseOut",drag:!1,dur:c.scrollInertia,overwrite:"all",callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},n=e.extend(d,n),u=[n.dur,n.drag?0:n.dur],f=e("#mCSB_"+s.idx),h=e("#mCSB_"+s.idx+"_container"),m=h.parent(),p=c.callbacks.onTotalScrollOffset?Y.call(t,c.callbacks.onTotalScrollOffset):[0,0],g=c.callbacks.onTotalScrollBackOffset?Y.call(t,c.callbacks.onTotalScrollBackOffset):[0,0];if(s.trigger=n.trigger,0===m.scrollTop()&&0===m.scrollLeft()||(e(".mCSB_"+s.idx+"_scrollbar").css("visibility","visible"),m.scrollTop(0).scrollLeft(0)),"_resetY"!==o||s.contentReset.y||(i("onOverflowYNone")&&c.callbacks.onOverflowYNone.call(t[0]),s.contentReset.y=1),"_resetX"!==o||s.contentReset.x||(i("onOverflowXNone")&&c.callbacks.onOverflowXNone.call(t[0]),s.contentReset.x=1),"_resetY"!==o&&"_resetX"!==o){if(!s.contentReset.y&&t[0].mcs||!s.overflowed[0]||(i("onOverflowY")&&c.callbacks.onOverflowY.call(t[0]),s.contentReset.x=null),!s.contentReset.x&&t[0].mcs||!s.overflowed[1]||(i("onOverflowX")&&c.callbacks.onOverflowX.call(t[0]),s.contentReset.x=null),c.snapAmount){var v=c.snapAmount instanceof Array?"x"===n.dir?c.snapAmount[1]:c.snapAmount[0]:c.snapAmount;o=V(o,v,c.snapOffset)}switch(n.dir){case"x":var x=e("#mCSB_"+s.idx+"_dragger_horizontal"),_="left",w=h[0].offsetLeft,S=[f.width()-h.outerWidth(!1),x.parent().width()-x.width()],b=[o,0===o?0:o/s.scrollRatio.x],y=p[1],B=g[1],T=y>0?y/s.scrollRatio.x:0,k=B>0?B/s.scrollRatio.x:0;break;case"y":var x=e("#mCSB_"+s.idx+"_dragger_vertical"),_="top",w=h[0].offsetTop,S=[f.height()-h.outerHeight(!1),x.parent().height()-x.height()],b=[o,0===o?0:o/s.scrollRatio.y],y=p[0],B=g[0],T=y>0?y/s.scrollRatio.y:0,k=B>0?B/s.scrollRatio.y:0}b[1]<0||0===b[0]&&0===b[1]?b=[0,0]:b[1]>=S[1]?b=[S[0],S[1]]:b[0]=-b[0],t[0].mcs||(l(),i("onInit")&&c.callbacks.onInit.call(t[0])),clearTimeout(h[0].onCompleteTimeout),J(x[0],_,Math.round(b[1]),u[1],n.scrollEasing),!s.tweenRunning&&(0===w&&b[0]>=0||w===S[0]&&b[0]<=S[0])||J(h[0],_,Math.round(b[0]),u[0],n.scrollEasing,n.overwrite,{onStart:function(){n.callbacks&&n.onStart&&!s.tweenRunning&&(i("onScrollStart")&&(l(),c.callbacks.onScrollStart.call(t[0])),s.tweenRunning=!0,C(x),s.cbOffsets=r())},onUpdate:function(){n.callbacks&&n.onUpdate&&i("whileScrolling")&&(l(),c.callbacks.whileScrolling.call(t[0]))},onComplete:function(){if(n.callbacks&&n.onComplete){"yx"===c.axis&&clearTimeout(h[0].onCompleteTimeout);var e=h[0].idleTimer||0;h[0].onCompleteTimeout=setTimeout(function(){i("onScroll")&&(l(),c.callbacks.onScroll.call(t[0])),i("onTotalScroll")&&b[1]>=S[1]-T&&s.cbOffsets[0]&&(l(),c.callbacks.onTotalScroll.call(t[0])),i("onTotalScrollBack")&&b[1]<=k&&s.cbOffsets[1]&&(l(),c.callbacks.onTotalScrollBack.call(t[0])),s.tweenRunning=!1,h[0].idleTimer=0,C(x,"hide")},e)}}})}},J=function(e,t,o,a,n,i,r){function l(){S.stop||(x||m.call(),x=K()-v,s(),x>=S.time&&(S.time=x>S.time?x+f-(x-S.time):x+f-1,S.time<x+1&&(S.time=x+1)),S.time<a?S.id=h(l):g.call())}function s(){a>0?(S.currVal=u(S.time,_,b,a,n),w[t]=Math.round(S.currVal)+"px"):w[t]=o+"px",p.call()}function c(){f=1e3/60,S.time=x+f,h=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return s(),setTimeout(e,.01)},S.id=h(l)}function d(){null!=S.id&&(window.requestAnimationFrame?window.cancelAnimationFrame(S.id):clearTimeout(S.id),S.id=null)}function u(e,t,o,a,n){switch(n){case"linear":case"mcsLinear":return o*e/a+t;case"mcsLinearOut":return e/=a,e--,o*Math.sqrt(1-e*e)+t;case"easeInOutSmooth":return e/=a/2,1>e?o/2*e*e+t:(e--,-o/2*(e*(e-2)-1)+t);case"easeInOutStrong":return e/=a/2,1>e?o/2*Math.pow(2,10*(e-1))+t:(e--,o/2*(-Math.pow(2,-10*e)+2)+t);case"easeInOut":case"mcsEaseInOut":return e/=a/2,1>e?o/2*e*e*e+t:(e-=2,o/2*(e*e*e+2)+t);case"easeOutSmooth":return e/=a,e--,-o*(e*e*e*e-1)+t;case"easeOutStrong":return o*(-Math.pow(2,-10*e/a)+1)+t;case"easeOut":case"mcsEaseOut":default:var i=(e/=a)*e,r=i*e;return t+o*(.499999999999997*r*i+-2.5*i*i+5.5*r+-6.5*i+4*e)}}e._mTween||(e._mTween={top:{},left:{}});var f,h,r=r||{},m=r.onStart||function(){},p=r.onUpdate||function(){},g=r.onComplete||function(){},v=K(),x=0,_=e.offsetTop,w=e.style,S=e._mTween[t];"left"===t&&(_=e.offsetLeft);var b=o-_;S.stop=0,"none"!==i&&d(),c()},K=function(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()},Z=function(){var e=this;e._mTween||(e._mTween={top:{},left:{}});for(var t=["top","left"],o=0;o<t.length;o++){var a=t[o];e._mTween[a].id&&(window.requestAnimationFrame?window.cancelAnimationFrame(e._mTween[a].id):clearTimeout(e._mTween[a].id),e._mTween[a].id=null,e._mTween[a].stop=1)}},$=function(e,t){try{delete e[t]}catch(o){e[t]=null}},ee=function(e){return!(e.which&&1!==e.which)},te=function(e){var t=e.originalEvent.pointerType;return!(t&&"touch"!==t&&2!==t)},oe=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},ae=function(e){var t=e.parents(".mCSB_container");return[e.offset().top-t.offset().top,e.offset().left-t.offset().left]},ne=function(){function e(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)if(e[t]+"Hidden"in document)return e[t]+"Hidden";return null}var t=e();return t?document[t]:!1};e.fn[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o].defaults=i,window[o]=!0,e(window).bind("load",function(){e(n)[o](),e.extend(e.expr[":"],{mcsInView:e.expr[":"].mcsInView||function(t){var o,a,n=e(t),i=n.parents(".mCSB_container");if(i.length)return o=i.parent(),a=[i[0].offsetTop,i[0].offsetLeft],a[0]+ae(n)[0]>=0&&a[0]+ae(n)[0]<o.height()-n.outerHeight(!1)&&a[1]+ae(n)[1]>=0&&a[1]+ae(n)[1]<o.width()-n.outerWidth(!1)},mcsInSight:e.expr[":"].mcsInSight||function(t,o,a){var n,i,r,l,s=e(t),c=s.parents(".mCSB_container"),d="exact"===a[3]?[[1,0],[1,0]]:[[.9,.1],[.6,.4]];if(c.length)return n=[s.outerHeight(!1),s.outerWidth(!1)],r=[c[0].offsetTop+ae(s)[0],c[0].offsetLeft+ae(s)[1]],i=[c.parent()[0].offsetHeight,c.parent()[0].offsetWidth],l=[n[0]<i[0]?d[0]:d[1],n[1]<i[1]?d[0]:d[1]],r[0]-i[0]*l[0][0]<0&&r[0]+n[0]-i[0]*l[0][1]>=0&&r[1]-i[1]*l[1][0]<0&&r[1]+n[1]-i[1]*l[1][1]>=0},mcsOverflow:e.expr[":"].mcsOverflow||function(t){var o=e(t).data(a);if(o)return o.overflowed[0]||o.overflowed[1]}})})})});
/* PrognRoll | https://mburakerman.github.io/prognroll/ | @mburakerman | License: MIT */
(function($) {
    $.fn.prognroll = function(options) {

        var settings = $.extend({
            height: 2, //Progress bar height
            color: "#69425B", //Progress bar background color
            custom: false //If you make it true, you can add your custom div and see it's scroll progress on the page.
        }, options);

        return this.each(function() {
            if ($(this).data('prognroll')) {
                return false;
            }
            $(this).data('prognroll', true);

            var $span = $("<span>", {
                class: "bar"
            });
            $("body").prepend($span);

            $span.css({
                position: "fixed",
                top: 0,
                left: 0,
                width: 0,
                height: settings.height,
                backgroundColor: settings.color,
                zIndex: 9999999
            });

            if (settings.custom === false) {

                $(window).scroll(function(e) {
                    e.preventDefault();
                    var windowScrollTop = $(window).scrollTop();
                    var windowHeight = $(window).outerHeight();
                    var bodyHeight = $(document).height();

                    var total = (windowScrollTop / (bodyHeight - windowHeight)) * 100;

                    $(".bar").css("width", total + "%");
                });

            } else {

                $(this).scroll(function(e) {
                    e.preventDefault();
                    var customScrollTop = $(this).scrollTop();
                    var customHeight = $(this).outerHeight();
                    var customScrollHeight = $(this).prop("scrollHeight");

                    var total = (customScrollTop / (customScrollHeight - customHeight)) * 100;

                    $(".bar").css("width", total + "%");
                });

            }

            /* Get scroll position on on page load */
            $(window).on('hashchange', function(e) {
                e.preventDefault();
                console.log($(window).scrollTop());
            });
            $(window).trigger('hashchange');

            var windowScrollTop = $(window).scrollTop();
            var windowHeight = $(window).outerHeight();
            var bodyHeight = $("body").outerHeight();

            var total = (windowScrollTop / (bodyHeight - windowHeight)) * 100;

            $(".bar").css("width", total + "%");
            /* Get scroll position on on page load */

        });
    };
})(jQuery);
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
;(function(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
  } else {
      factory(jQuery);
  }

}(function($) {
  'use strict';
  var Slick = window.Slick || {};

  Slick = (function() {

      var instanceUid = 0;

      function Slick(element, settings) {

          var _ = this, dataSettings;

          _.defaults = {
              accessibility: true,
              adaptiveHeight: false,
              appendArrows: $(element),
              appendDots: $(element),
              arrows: true,
              asNavFor: null,
              prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
              nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
              autoplay: false,
              autoplaySpeed: 3000,
              centerMode: false,
              centerPadding: '50px',
              cssEase: 'ease',
              customPaging: function(slider, i) {
                  return $('<button type="button" />').text(i + 1);
              },
              dots: false,
              dotsClass: 'slick-dots',
              draggable: true,
              easing: 'linear',
              edgeFriction: 0.35,
              fade: false,
              focusOnSelect: false,
              focusOnChange: false,
              infinite: true,
              initialSlide: 0,
              lazyLoad: 'ondemand',
              mobileFirst: false,
              pauseOnHover: true,
              pauseOnFocus: true,
              pauseOnDotsHover: false,
              respondTo: 'window',
              responsive: null,
              rows: 1,
              rtl: false,
              slide: '',
              slidesPerRow: 1,
              slidesToShow: 1,
              slidesToScroll: 1,
              speed: 500,
              swipe: true,
              swipeToSlide: false,
              touchMove: true,
              touchThreshold: 5,
              useCSS: true,
              useTransform: true,
              variableWidth: false,
              vertical: false,
              verticalSwiping: false,
              waitForAnimate: true,
              zIndex: 1000
          };

          _.initials = {
              animating: false,
              dragging: false,
              autoPlayTimer: null,
              currentDirection: 0,
              currentLeft: null,
              currentSlide: 0,
              direction: 1,
              $dots: null,
              listWidth: null,
              listHeight: null,
              loadIndex: 0,
              $nextArrow: null,
              $prevArrow: null,
              scrolling: false,
              slideCount: null,
              slideWidth: null,
              $slideTrack: null,
              $slides: null,
              sliding: false,
              slideOffset: 0,
              swipeLeft: null,
              swiping: false,
              $list: null,
              touchObject: {},
              transformsEnabled: false,
              unslicked: false
          };

          $.extend(_, _.initials);

          _.activeBreakpoint = null;
          _.animType = null;
          _.animProp = null;
          _.breakpoints = [];
          _.breakpointSettings = [];
          _.cssTransitions = false;
          _.focussed = false;
          _.interrupted = false;
          _.hidden = 'hidden';
          _.paused = true;
          _.positionProp = null;
          _.respondTo = null;
          _.rowCount = 1;
          _.shouldClick = true;
          _.$slider = $(element);
          _.$slidesCache = null;
          _.transformType = null;
          _.transitionType = null;
          _.visibilityChange = 'visibilitychange';
          _.windowWidth = 0;
          _.windowTimer = null;

          dataSettings = $(element).data('slick') || {};

          _.options = $.extend({}, _.defaults, settings, dataSettings);

          _.currentSlide = _.options.initialSlide;

          _.originalSettings = _.options;

          if (typeof document.mozHidden !== 'undefined') {
              _.hidden = 'mozHidden';
              _.visibilityChange = 'mozvisibilitychange';
          } else if (typeof document.webkitHidden !== 'undefined') {
              _.hidden = 'webkitHidden';
              _.visibilityChange = 'webkitvisibilitychange';
          }

          _.autoPlay = $.proxy(_.autoPlay, _);
          _.autoPlayClear = $.proxy(_.autoPlayClear, _);
          _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
          _.changeSlide = $.proxy(_.changeSlide, _);
          _.clickHandler = $.proxy(_.clickHandler, _);
          _.selectHandler = $.proxy(_.selectHandler, _);
          _.setPosition = $.proxy(_.setPosition, _);
          _.swipeHandler = $.proxy(_.swipeHandler, _);
          _.dragHandler = $.proxy(_.dragHandler, _);
          _.keyHandler = $.proxy(_.keyHandler, _);

          _.instanceUid = instanceUid++;

          // A simple way to check for HTML strings
          // Strict HTML recognition (must start with <)
          // Extracted from jQuery v1.11 source
          _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


          _.registerBreakpoints();
          _.init(true);

      }

      return Slick;

  }());

  Slick.prototype.activateADA = function() {
      var _ = this;

      _.$slideTrack.find('.slick-active').attr({
          'aria-hidden': 'false'
      }).find('a, input, button, select').attr({
          'tabindex': '0'
      });

  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

      var _ = this;

      if (typeof(index) === 'boolean') {
          addBefore = index;
          index = null;
      } else if (index < 0 || (index >= _.slideCount)) {
          return false;
      }

      _.unload();

      if (typeof(index) === 'number') {
          if (index === 0 && _.$slides.length === 0) {
              $(markup).appendTo(_.$slideTrack);
          } else if (addBefore) {
              $(markup).insertBefore(_.$slides.eq(index));
          } else {
              $(markup).insertAfter(_.$slides.eq(index));
          }
      } else {
          if (addBefore === true) {
              $(markup).prependTo(_.$slideTrack);
          } else {
              $(markup).appendTo(_.$slideTrack);
          }
      }

      _.$slides = _.$slideTrack.children(this.options.slide);

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.append(_.$slides);

      _.$slides.each(function(index, element) {
          $(element).attr('data-slick-index', index);
      });

      _.$slidesCache = _.$slides;

      _.reinit();

  };

  Slick.prototype.animateHeight = function() {
      var _ = this;
      if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
          var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
          _.$list.animate({
              height: targetHeight
          }, _.options.speed);
      }
  };

  Slick.prototype.animateSlide = function(targetLeft, callback) {

      var animProps = {},
          _ = this;

      _.animateHeight();

      if (_.options.rtl === true && _.options.vertical === false) {
          targetLeft = -targetLeft;
      }
      if (_.transformsEnabled === false) {
          if (_.options.vertical === false) {
              _.$slideTrack.animate({
                  left: targetLeft
              }, _.options.speed, _.options.easing, callback);
          } else {
              _.$slideTrack.animate({
                  top: targetLeft
              }, _.options.speed, _.options.easing, callback);
          }

      } else {

          if (_.cssTransitions === false) {
              if (_.options.rtl === true) {
                  _.currentLeft = -(_.currentLeft);
              }
              $({
                  animStart: _.currentLeft
              }).animate({
                  animStart: targetLeft
              }, {
                  duration: _.options.speed,
                  easing: _.options.easing,
                  step: function(now) {
                      now = Math.ceil(now);
                      if (_.options.vertical === false) {
                          animProps[_.animType] = 'translate(' +
                              now + 'px, 0px)';
                          _.$slideTrack.css(animProps);
                      } else {
                          animProps[_.animType] = 'translate(0px,' +
                              now + 'px)';
                          _.$slideTrack.css(animProps);
                      }
                  },
                  complete: function() {
                      if (callback) {
                          callback.call();
                      }
                  }
              });

          } else {

              _.applyTransition();
              targetLeft = Math.ceil(targetLeft);

              if (_.options.vertical === false) {
                  animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
              } else {
                  animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
              }
              _.$slideTrack.css(animProps);

              if (callback) {
                  setTimeout(function() {

                      _.disableTransition();

                      callback.call();
                  }, _.options.speed);
              }

          }

      }

  };

  Slick.prototype.getNavTarget = function() {

      var _ = this,
          asNavFor = _.options.asNavFor;

      if ( asNavFor && asNavFor !== null ) {
          asNavFor = $(asNavFor).not(_.$slider);
      }

      return asNavFor;

  };

  Slick.prototype.asNavFor = function(index) {

      var _ = this,
          asNavFor = _.getNavTarget();

      if ( asNavFor !== null && typeof asNavFor === 'object' ) {
          asNavFor.each(function() {
              var target = $(this).slick('getSlick');
              if(!target.unslicked) {
                  target.slideHandler(index, true);
              }
          });
      }

  };

  Slick.prototype.applyTransition = function(slide) {

      var _ = this,
          transition = {};

      if (_.options.fade === false) {
          transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
      } else {
          transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
      }

      if (_.options.fade === false) {
          _.$slideTrack.css(transition);
      } else {
          _.$slides.eq(slide).css(transition);
      }

  };

  Slick.prototype.autoPlay = function() {

      var _ = this;

      _.autoPlayClear();

      if ( _.slideCount > _.options.slidesToShow ) {
          _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
      }

  };

  Slick.prototype.autoPlayClear = function() {

      var _ = this;

      if (_.autoPlayTimer) {
          clearInterval(_.autoPlayTimer);
      }

  };

  Slick.prototype.autoPlayIterator = function() {

      var _ = this,
          slideTo = _.currentSlide + _.options.slidesToScroll;

      if ( !_.paused && !_.interrupted && !_.focussed ) {

          if ( _.options.infinite === false ) {

              if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                  _.direction = 0;
              }

              else if ( _.direction === 0 ) {

                  slideTo = _.currentSlide - _.options.slidesToScroll;

                  if ( _.currentSlide - 1 === 0 ) {
                      _.direction = 1;
                  }

              }

          }

          _.slideHandler( slideTo );

      }

  };

  Slick.prototype.buildArrows = function() {

      var _ = this;

      if (_.options.arrows === true ) {

          _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
          _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

          if( _.slideCount > _.options.slidesToShow ) {

              _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
              _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

              if (_.htmlExpr.test(_.options.prevArrow)) {
                  _.$prevArrow.prependTo(_.options.appendArrows);
              }

              if (_.htmlExpr.test(_.options.nextArrow)) {
                  _.$nextArrow.appendTo(_.options.appendArrows);
              }

              if (_.options.infinite !== true) {
                  _.$prevArrow
                      .addClass('slick-disabled')
                      .attr('aria-disabled', 'true');
              }

          } else {

              _.$prevArrow.add( _.$nextArrow )

                  .addClass('slick-hidden')
                  .attr({
                      'aria-disabled': 'true',
                      'tabindex': '-1'
                  });

          }

      }

  };

  Slick.prototype.buildDots = function() {

      var _ = this,
          i, dot;

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

          _.$slider.addClass('slick-dotted');

          dot = $('<ul />').addClass(_.options.dotsClass);

          for (i = 0; i <= _.getDotCount(); i += 1) {
              dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
          }

          _.$dots = dot.appendTo(_.options.appendDots);

          _.$dots.find('li').first().addClass('slick-active');

      }

  };

  Slick.prototype.buildOut = function() {

      var _ = this;

      _.$slides =
          _.$slider
              .children( _.options.slide + ':not(.slick-cloned)')
              .addClass('slick-slide');

      _.slideCount = _.$slides.length;

      _.$slides.each(function(index, element) {
          $(element)
              .attr('data-slick-index', index)
              .data('originalStyling', $(element).attr('style') || '');
      });

      _.$slider.addClass('slick-slider');

      _.$slideTrack = (_.slideCount === 0) ?
          $('<div class="slick-track"/>').appendTo(_.$slider) :
          _.$slides.wrapAll('<div class="slick-track"/>').parent();

      _.$list = _.$slideTrack.wrap(
          '<div class="slick-list"/>').parent();
      _.$slideTrack.css('opacity', 0);

      if (_.options.centerMode === true || _.options.swipeToSlide === true) {
          _.options.slidesToScroll = 1;
      }

      $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

      _.setupInfinite();

      _.buildArrows();

      _.buildDots();

      _.updateDots();


      _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

      if (_.options.draggable === true) {
          _.$list.addClass('draggable');
      }

  };

  Slick.prototype.buildRows = function() {

      var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

      newSlides = document.createDocumentFragment();
      originalSlides = _.$slider.children();

      if(_.options.rows > 0) {

          slidesPerSection = _.options.slidesPerRow * _.options.rows;
          numOfSlides = Math.ceil(
              originalSlides.length / slidesPerSection
          );

          for(a = 0; a < numOfSlides; a++){
              var slide = document.createElement('div');
              for(b = 0; b < _.options.rows; b++) {
                  var row = document.createElement('div');
                  for(c = 0; c < _.options.slidesPerRow; c++) {
                      var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                      if (originalSlides.get(target)) {
                          row.appendChild(originalSlides.get(target));
                      }
                  }
                  slide.appendChild(row);
              }
              newSlides.appendChild(slide);
          }

          _.$slider.empty().append(newSlides);
          _.$slider.children().children().children()
              .css({
                  'width':(100 / _.options.slidesPerRow) + '%',
                  'display': 'inline-block'
              });

      }

  };

  Slick.prototype.checkResponsive = function(initial, forceUpdate) {

      var _ = this,
          breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
      var sliderWidth = _.$slider.width();
      var windowWidth = window.innerWidth || $(window).width();

      if (_.respondTo === 'window') {
          respondToWidth = windowWidth;
      } else if (_.respondTo === 'slider') {
          respondToWidth = sliderWidth;
      } else if (_.respondTo === 'min') {
          respondToWidth = Math.min(windowWidth, sliderWidth);
      }

      if ( _.options.responsive &&
          _.options.responsive.length &&
          _.options.responsive !== null) {

          targetBreakpoint = null;

          for (breakpoint in _.breakpoints) {
              if (_.breakpoints.hasOwnProperty(breakpoint)) {
                  if (_.originalSettings.mobileFirst === false) {
                      if (respondToWidth < _.breakpoints[breakpoint]) {
                          targetBreakpoint = _.breakpoints[breakpoint];
                      }
                  } else {
                      if (respondToWidth > _.breakpoints[breakpoint]) {
                          targetBreakpoint = _.breakpoints[breakpoint];
                      }
                  }
              }
          }

          if (targetBreakpoint !== null) {
              if (_.activeBreakpoint !== null) {
                  if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                      _.activeBreakpoint =
                          targetBreakpoint;
                      if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                          _.unslick(targetBreakpoint);
                      } else {
                          _.options = $.extend({}, _.originalSettings,
                              _.breakpointSettings[
                                  targetBreakpoint]);
                          if (initial === true) {
                              _.currentSlide = _.options.initialSlide;
                          }
                          _.refresh(initial);
                      }
                      triggerBreakpoint = targetBreakpoint;
                  }
              } else {
                  _.activeBreakpoint = targetBreakpoint;
                  if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                      _.unslick(targetBreakpoint);
                  } else {
                      _.options = $.extend({}, _.originalSettings,
                          _.breakpointSettings[
                              targetBreakpoint]);
                      if (initial === true) {
                          _.currentSlide = _.options.initialSlide;
                      }
                      _.refresh(initial);
                  }
                  triggerBreakpoint = targetBreakpoint;
              }
          } else {
              if (_.activeBreakpoint !== null) {
                  _.activeBreakpoint = null;
                  _.options = _.originalSettings;
                  if (initial === true) {
                      _.currentSlide = _.options.initialSlide;
                  }
                  _.refresh(initial);
                  triggerBreakpoint = targetBreakpoint;
              }
          }

          // only trigger breakpoints during an actual break. not on initialize.
          if( !initial && triggerBreakpoint !== false ) {
              _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
          }
      }

  };

  Slick.prototype.changeSlide = function(event, dontAnimate) {

      var _ = this,
          $target = $(event.currentTarget),
          indexOffset, slideOffset, unevenOffset;

      // If target is a link, prevent default action.
      if($target.is('a')) {
          event.preventDefault();
      }

      // If target is not the <li> element (ie: a child), find the <li>.
      if(!$target.is('li')) {
          $target = $target.closest('li');
      }

      unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
      indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

      switch (event.data.message) {

          case 'previous':
              slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
              if (_.slideCount > _.options.slidesToShow) {
                  _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
              }
              break;

          case 'next':
              slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
              if (_.slideCount > _.options.slidesToShow) {
                  _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
              }
              break;

          case 'index':
              var index = event.data.index === 0 ? 0 :
                  event.data.index || $target.index() * _.options.slidesToScroll;

              _.slideHandler(_.checkNavigable(index), false, dontAnimate);
              $target.children().trigger('focus');
              break;

          default:
              return;
      }

  };

  Slick.prototype.checkNavigable = function(index) {

      var _ = this,
          navigables, prevNavigable;

      navigables = _.getNavigableIndexes();
      prevNavigable = 0;
      if (index > navigables[navigables.length - 1]) {
          index = navigables[navigables.length - 1];
      } else {
          for (var n in navigables) {
              if (index < navigables[n]) {
                  index = prevNavigable;
                  break;
              }
              prevNavigable = navigables[n];
          }
      }

      return index;
  };

  Slick.prototype.cleanUpEvents = function() {

      var _ = this;

      if (_.options.dots && _.$dots !== null) {

          $('li', _.$dots)
              .off('click.slick', _.changeSlide)
              .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
              .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

          if (_.options.accessibility === true) {
              _.$dots.off('keydown.slick', _.keyHandler);
          }
      }

      _.$slider.off('focus.slick blur.slick');

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
          _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
          _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

          if (_.options.accessibility === true) {
              _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
              _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
          }
      }

      _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
      _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
      _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
      _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

      _.$list.off('click.slick', _.clickHandler);

      $(document).off(_.visibilityChange, _.visibility);

      _.cleanUpSlideEvents();

      if (_.options.accessibility === true) {
          _.$list.off('keydown.slick', _.keyHandler);
      }

      if (_.options.focusOnSelect === true) {
          $(_.$slideTrack).children().off('click.slick', _.selectHandler);
      }

      $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

      $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

      $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

      $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

  };

  Slick.prototype.cleanUpSlideEvents = function() {

      var _ = this;

      _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
      _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

  };

  Slick.prototype.cleanUpRows = function() {

      var _ = this, originalSlides;

      if(_.options.rows > 0) {
          originalSlides = _.$slides.children().children();
          originalSlides.removeAttr('style');
          _.$slider.empty().append(originalSlides);
      }

  };

  Slick.prototype.clickHandler = function(event) {

      var _ = this;

      if (_.shouldClick === false) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();
      }

  };

  Slick.prototype.destroy = function(refresh) {

      var _ = this;

      _.autoPlayClear();

      _.touchObject = {};

      _.cleanUpEvents();

      $('.slick-cloned', _.$slider).detach();

      if (_.$dots) {
          _.$dots.remove();
      }

      if ( _.$prevArrow && _.$prevArrow.length ) {

          _.$prevArrow
              .removeClass('slick-disabled slick-arrow slick-hidden')
              .removeAttr('aria-hidden aria-disabled tabindex')
              .css('display','');

          if ( _.htmlExpr.test( _.options.prevArrow )) {
              _.$prevArrow.remove();
          }
      }

      if ( _.$nextArrow && _.$nextArrow.length ) {

          _.$nextArrow
              .removeClass('slick-disabled slick-arrow slick-hidden')
              .removeAttr('aria-hidden aria-disabled tabindex')
              .css('display','');

          if ( _.htmlExpr.test( _.options.nextArrow )) {
              _.$nextArrow.remove();
          }
      }


      if (_.$slides) {

          _.$slides
              .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
              .removeAttr('aria-hidden')
              .removeAttr('data-slick-index')
              .each(function(){
                  $(this).attr('style', $(this).data('originalStyling'));
              });

          _.$slideTrack.children(this.options.slide).detach();

          _.$slideTrack.detach();

          _.$list.detach();

          _.$slider.append(_.$slides);
      }

      _.cleanUpRows();

      _.$slider.removeClass('slick-slider');
      _.$slider.removeClass('slick-initialized');
      _.$slider.removeClass('slick-dotted');

      _.unslicked = true;

      if(!refresh) {
          _.$slider.trigger('destroy', [_]);
      }

  };

  Slick.prototype.disableTransition = function(slide) {

      var _ = this,
          transition = {};

      transition[_.transitionType] = '';

      if (_.options.fade === false) {
          _.$slideTrack.css(transition);
      } else {
          _.$slides.eq(slide).css(transition);
      }

  };

  Slick.prototype.fadeSlide = function(slideIndex, callback) {

      var _ = this;

      if (_.cssTransitions === false) {

          _.$slides.eq(slideIndex).css({
              zIndex: _.options.zIndex
          });

          _.$slides.eq(slideIndex).animate({
              opacity: 1
          }, _.options.speed, _.options.easing, callback);

      } else {

          _.applyTransition(slideIndex);

          _.$slides.eq(slideIndex).css({
              opacity: 1,
              zIndex: _.options.zIndex
          });

          if (callback) {
              setTimeout(function() {

                  _.disableTransition(slideIndex);

                  callback.call();
              }, _.options.speed);
          }

      }

  };

  Slick.prototype.fadeSlideOut = function(slideIndex) {

      var _ = this;

      if (_.cssTransitions === false) {

          _.$slides.eq(slideIndex).animate({
              opacity: 0,
              zIndex: _.options.zIndex - 2
          }, _.options.speed, _.options.easing);

      } else {

          _.applyTransition(slideIndex);

          _.$slides.eq(slideIndex).css({
              opacity: 0,
              zIndex: _.options.zIndex - 2
          });

      }

  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

      var _ = this;

      if (filter !== null) {

          _.$slidesCache = _.$slides;

          _.unload();

          _.$slideTrack.children(this.options.slide).detach();

          _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

          _.reinit();

      }

  };

  Slick.prototype.focusHandler = function() {

      var _ = this;

      // If any child element receives focus within the slider we need to pause the autoplay
      _.$slider
          .off('focus.slick blur.slick')
          .on(
              'focus.slick',
              '*',
              function(event) {
                  var $sf = $(this);

                  setTimeout(function() {
                      if( _.options.pauseOnFocus ) {
                          if ($sf.is(':focus')) {
                              _.focussed = true;
                              _.autoPlay();
                          }
                      }
                  }, 0);
              }
          ).on(
              'blur.slick',
              '*',
              function(event) {
                  var $sf = $(this);

                  // When a blur occurs on any elements within the slider we become unfocused
                  if( _.options.pauseOnFocus ) {
                      _.focussed = false;
                      _.autoPlay();
                  }
              }
          );
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

      var _ = this;
      return _.currentSlide;

  };

  Slick.prototype.getDotCount = function() {

      var _ = this;

      var breakPoint = 0;
      var counter = 0;
      var pagerQty = 0;

      if (_.options.infinite === true) {
          if (_.slideCount <= _.options.slidesToShow) {
               ++pagerQty;
          } else {
              while (breakPoint < _.slideCount) {
                  ++pagerQty;
                  breakPoint = counter + _.options.slidesToScroll;
                  counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
              }
          }
      } else if (_.options.centerMode === true) {
          pagerQty = _.slideCount;
      } else if(!_.options.asNavFor) {
          pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
      }else {
          while (breakPoint < _.slideCount) {
              ++pagerQty;
              breakPoint = counter + _.options.slidesToScroll;
              counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
          }
      }

      return pagerQty - 1;

  };

  Slick.prototype.getLeft = function(slideIndex) {

      var _ = this,
          targetLeft,
          verticalHeight,
          verticalOffset = 0,
          targetSlide,
          coef;

      _.slideOffset = 0;
      verticalHeight = _.$slides.first().outerHeight(true);

      if (_.options.infinite === true) {
          if (_.slideCount > _.options.slidesToShow) {
              _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
              coef = -1

              if (_.options.vertical === true && _.options.centerMode === true) {
                  if (_.options.slidesToShow === 2) {
                      coef = -1.5;
                  } else if (_.options.slidesToShow === 1) {
                      coef = -2
                  }
              }
              verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
          }
          if (_.slideCount % _.options.slidesToScroll !== 0) {
              if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                  if (slideIndex > _.slideCount) {
                      _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                      verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                  } else {
                      _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                      verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                  }
              }
          }
      } else {
          if (slideIndex + _.options.slidesToShow > _.slideCount) {
              _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
              verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
          }
      }

      if (_.slideCount <= _.options.slidesToShow) {
          _.slideOffset = 0;
          verticalOffset = 0;
      }

      if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
          _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
      } else if (_.options.centerMode === true && _.options.infinite === true) {
          _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
      } else if (_.options.centerMode === true) {
          _.slideOffset = 0;
          _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
      }

      if (_.options.vertical === false) {
          targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
      } else {
          targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
      }

      if (_.options.variableWidth === true) {

          if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
              targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
          } else {
              targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
          }

          if (_.options.rtl === true) {
              if (targetSlide[0]) {
                  targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
              } else {
                  targetLeft =  0;
              }
          } else {
              targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
          }

          if (_.options.centerMode === true) {
              if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                  targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
              } else {
                  targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
              }

              if (_.options.rtl === true) {
                  if (targetSlide[0]) {
                      targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                  } else {
                      targetLeft =  0;
                  }
              } else {
                  targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
              }

              targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
          }
      }

      return targetLeft;

  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

      var _ = this;

      return _.options[option];

  };

  Slick.prototype.getNavigableIndexes = function() {

      var _ = this,
          breakPoint = 0,
          counter = 0,
          indexes = [],
          max;

      if (_.options.infinite === false) {
          max = _.slideCount;
      } else {
          breakPoint = _.options.slidesToScroll * -1;
          counter = _.options.slidesToScroll * -1;
          max = _.slideCount * 2;
      }

      while (breakPoint < max) {
          indexes.push(breakPoint);
          breakPoint = counter + _.options.slidesToScroll;
          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }

      return indexes;

  };

  Slick.prototype.getSlick = function() {

      return this;

  };

  Slick.prototype.getSlideCount = function() {

      var _ = this,
          slidesTraversed, swipedSlide, swipeTarget, centerOffset;

      centerOffset = _.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0;
      swipeTarget = (_.swipeLeft * -1) + centerOffset;

      if (_.options.swipeToSlide === true) {

          _.$slideTrack.find('.slick-slide').each(function(index, slide) {

              var slideOuterWidth, slideOffset, slideRightBoundary;
              slideOuterWidth = $(slide).outerWidth();
              slideOffset = slide.offsetLeft;
              if (_.options.centerMode !== true) {
                  slideOffset += (slideOuterWidth / 2);
              }

              slideRightBoundary = slideOffset + (slideOuterWidth);

              if (swipeTarget < slideRightBoundary) {
                  swipedSlide = slide;
                  return false;
              }
          });

          slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

          return slidesTraversed;

      } else {
          return _.options.slidesToScroll;
      }

  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

      var _ = this;

      _.changeSlide({
          data: {
              message: 'index',
              index: parseInt(slide)
          }
      }, dontAnimate);

  };

  Slick.prototype.init = function(creation) {

      var _ = this;

      if (!$(_.$slider).hasClass('slick-initialized')) {

          $(_.$slider).addClass('slick-initialized');

          _.buildRows();
          _.buildOut();
          _.setProps();
          _.startLoad();
          _.loadSlider();
          _.initializeEvents();
          _.updateArrows();
          _.updateDots();
          _.checkResponsive(true);
          _.focusHandler();

      }

      if (creation) {
          _.$slider.trigger('init', [_]);
      }

      if (_.options.accessibility === true) {
          _.initADA();
      }

      if ( _.options.autoplay ) {

          _.paused = false;
          _.autoPlay();

      }

  };

  Slick.prototype.initADA = function() {
      var _ = this,
              numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
              tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
                  return (val >= 0) && (val < _.slideCount);
              });

      _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
          'aria-hidden': 'true',
          'tabindex': '-1'
      }).find('a, input, button, select').attr({
          'tabindex': '-1'
      });

      if (_.$dots !== null) {
          _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
              var slideControlIndex = tabControlIndexes.indexOf(i);

              $(this).attr({
                  'role': 'tabpanel',
                  'id': 'slick-slide' + _.instanceUid + i,
                  'tabindex': -1
              });

              if (slideControlIndex !== -1) {
                 var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
                 if ($('#' + ariaButtonControl).length) {
                   $(this).attr({
                       'aria-describedby': ariaButtonControl
                   });
                 }
              }
          });

          _.$dots.attr('role', 'tablist').find('li').each(function(i) {
              var mappedSlideIndex = tabControlIndexes[i];

              $(this).attr({
                  'role': 'presentation'
              });

              $(this).find('button').first().attr({
                  'role': 'tab',
                  'id': 'slick-slide-control' + _.instanceUid + i,
                  'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
                  'aria-label': (i + 1) + ' of ' + numDotGroups,
                  'aria-selected': null,
                  'tabindex': '-1'
              });

          }).eq(_.currentSlide).find('button').attr({
              'aria-selected': 'true',
              'tabindex': '0'
          }).end();
      }

      for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
        if (_.options.focusOnChange) {
          _.$slides.eq(i).attr({'tabindex': '0'});
        } else {
          _.$slides.eq(i).removeAttr('tabindex');
        }
      }

      _.activateADA();

  };

  Slick.prototype.initArrowEvents = function() {

      var _ = this;

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
          _.$prevArrow
             .off('click.slick')
             .on('click.slick', {
                  message: 'previous'
             }, _.changeSlide);
          _.$nextArrow
             .off('click.slick')
             .on('click.slick', {
                  message: 'next'
             }, _.changeSlide);

          if (_.options.accessibility === true) {
              _.$prevArrow.on('keydown.slick', _.keyHandler);
              _.$nextArrow.on('keydown.slick', _.keyHandler);
          }
      }

  };

  Slick.prototype.initDotEvents = function() {

      var _ = this;

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
          $('li', _.$dots).on('click.slick', {
              message: 'index'
          }, _.changeSlide);

          if (_.options.accessibility === true) {
              _.$dots.on('keydown.slick', _.keyHandler);
          }
      }

      if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

          $('li', _.$dots)
              .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
              .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

      }

  };

  Slick.prototype.initSlideEvents = function() {

      var _ = this;

      if ( _.options.pauseOnHover ) {

          _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
          _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

      }

  };

  Slick.prototype.initializeEvents = function() {

      var _ = this;

      _.initArrowEvents();

      _.initDotEvents();
      _.initSlideEvents();

      _.$list.on('touchstart.slick mousedown.slick', {
          action: 'start'
      }, _.swipeHandler);
      _.$list.on('touchmove.slick mousemove.slick', {
          action: 'move'
      }, _.swipeHandler);
      _.$list.on('touchend.slick mouseup.slick', {
          action: 'end'
      }, _.swipeHandler);
      _.$list.on('touchcancel.slick mouseleave.slick', {
          action: 'end'
      }, _.swipeHandler);

      _.$list.on('click.slick', _.clickHandler);

      $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

      if (_.options.accessibility === true) {
          _.$list.on('keydown.slick', _.keyHandler);
      }

      if (_.options.focusOnSelect === true) {
          $(_.$slideTrack).children().on('click.slick', _.selectHandler);
      }

      $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

      $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

      $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

      $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
      $(_.setPosition);

  };

  Slick.prototype.initUI = function() {

      var _ = this;

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

          _.$prevArrow.show();
          _.$nextArrow.show();

      }

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

          _.$dots.show();

      }

  };

  Slick.prototype.keyHandler = function(event) {

      var _ = this;
       //Dont slide if the cursor is inside the form fields and arrow keys are pressed
      if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
          if (event.keyCode === 37 && _.options.accessibility === true) {
              _.changeSlide({
                  data: {
                      message: _.options.rtl === true ? 'next' :  'previous'
                  }
              });
          } else if (event.keyCode === 39 && _.options.accessibility === true) {
              _.changeSlide({
                  data: {
                      message: _.options.rtl === true ? 'previous' : 'next'
                  }
              });
          }
      }

  };

  Slick.prototype.lazyLoad = function() {

      var _ = this,
          loadRange, cloneRange, rangeStart, rangeEnd;

      function loadImages(imagesScope) {

          $('img[data-lazy]', imagesScope).each(function() {

              var image = $(this),
                  imageSource = $(this).attr('data-lazy'),
                  imageSrcSet = $(this).attr('data-srcset'),
                  imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                  imageToLoad = document.createElement('img');

              imageToLoad.onload = function() {

                  image
                      .animate({ opacity: 0 }, 100, function() {

                          if (imageSrcSet) {
                              image
                                  .attr('srcset', imageSrcSet );

                              if (imageSizes) {
                                  image
                                      .attr('sizes', imageSizes );
                              }
                          }

                          image
                              .attr('src', imageSource)
                              .animate({ opacity: 1 }, 200, function() {
                                  image
                                      .removeAttr('data-lazy data-srcset data-sizes')
                                      .removeClass('slick-loading');
                              });
                          _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                      });

              };

              imageToLoad.onerror = function() {

                  image
                      .removeAttr( 'data-lazy' )
                      .removeClass( 'slick-loading' )
                      .addClass( 'slick-lazyload-error' );

                  _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

              };

              imageToLoad.src = imageSource;

          });

      }

      if (_.options.centerMode === true) {
          if (_.options.infinite === true) {
              rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
              rangeEnd = rangeStart + _.options.slidesToShow + 2;
          } else {
              rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
              rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
          }
      } else {
          rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
          rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
          if (_.options.fade === true) {
              if (rangeStart > 0) rangeStart--;
              if (rangeEnd <= _.slideCount) rangeEnd++;
          }
      }

      loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

      if (_.options.lazyLoad === 'anticipated') {
          var prevSlide = rangeStart - 1,
              nextSlide = rangeEnd,
              $slides = _.$slider.find('.slick-slide');

          for (var i = 0; i < _.options.slidesToScroll; i++) {
              if (prevSlide < 0) prevSlide = _.slideCount - 1;
              loadRange = loadRange.add($slides.eq(prevSlide));
              loadRange = loadRange.add($slides.eq(nextSlide));
              prevSlide--;
              nextSlide++;
          }
      }

      loadImages(loadRange);

      if (_.slideCount <= _.options.slidesToShow) {
          cloneRange = _.$slider.find('.slick-slide');
          loadImages(cloneRange);
      } else
      if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
          cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
          loadImages(cloneRange);
      } else if (_.currentSlide === 0) {
          cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
          loadImages(cloneRange);
      }

  };

  Slick.prototype.loadSlider = function() {

      var _ = this;

      _.setPosition();

      _.$slideTrack.css({
          opacity: 1
      });

      _.$slider.removeClass('slick-loading');

      _.initUI();

      if (_.options.lazyLoad === 'progressive') {
          _.progressiveLazyLoad();
      }

  };

  Slick.prototype.next = Slick.prototype.slickNext = function() {

      var _ = this;

      _.changeSlide({
          data: {
              message: 'next'
          }
      });

  };

  Slick.prototype.orientationChange = function() {

      var _ = this;

      _.checkResponsive();
      _.setPosition();

  };

  Slick.prototype.pause = Slick.prototype.slickPause = function() {

      var _ = this;

      _.autoPlayClear();
      _.paused = true;

  };

  Slick.prototype.play = Slick.prototype.slickPlay = function() {

      var _ = this;

      _.autoPlay();
      _.options.autoplay = true;
      _.paused = false;
      _.focussed = false;
      _.interrupted = false;

  };

  Slick.prototype.postSlide = function(index) {

      var _ = this;

      if( !_.unslicked ) {

          _.$slider.trigger('afterChange', [_, index]);

          _.animating = false;

          if (_.slideCount > _.options.slidesToShow) {
              _.setPosition();
          }

          _.swipeLeft = null;

          if ( _.options.autoplay ) {
              _.autoPlay();
          }

          if (_.options.accessibility === true) {
              _.initADA();

              if (_.options.focusOnChange) {
                  var $currentSlide = $(_.$slides.get(_.currentSlide));
                  $currentSlide.attr('tabindex', 0).focus();
              }
          }

      }

  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function() {

      var _ = this;

      _.changeSlide({
          data: {
              message: 'previous'
          }
      });

  };

  Slick.prototype.preventDefault = function(event) {

      event.preventDefault();

  };

  Slick.prototype.progressiveLazyLoad = function( tryCount ) {

      tryCount = tryCount || 1;

      var _ = this,
          $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
          image,
          imageSource,
          imageSrcSet,
          imageSizes,
          imageToLoad;

      if ( $imgsToLoad.length ) {

          image = $imgsToLoad.first();
          imageSource = image.attr('data-lazy');
          imageSrcSet = image.attr('data-srcset');
          imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
          imageToLoad = document.createElement('img');

          imageToLoad.onload = function() {

              if (imageSrcSet) {
                  image
                      .attr('srcset', imageSrcSet );

                  if (imageSizes) {
                      image
                          .attr('sizes', imageSizes );
                  }
              }

              image
                  .attr( 'src', imageSource )
                  .removeAttr('data-lazy data-srcset data-sizes')
                  .removeClass('slick-loading');

              if ( _.options.adaptiveHeight === true ) {
                  _.setPosition();
              }

              _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
              _.progressiveLazyLoad();

          };

          imageToLoad.onerror = function() {

              if ( tryCount < 3 ) {

                  /**
                   * try to load the image 3 times,
                   * leave a slight delay so we don't get
                   * servers blocking the request.
                   */
                  setTimeout( function() {
                      _.progressiveLazyLoad( tryCount + 1 );
                  }, 500 );

              } else {

                  image
                      .removeAttr( 'data-lazy' )
                      .removeClass( 'slick-loading' )
                      .addClass( 'slick-lazyload-error' );

                  _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                  _.progressiveLazyLoad();

              }

          };

          imageToLoad.src = imageSource;

      } else {

          _.$slider.trigger('allImagesLoaded', [ _ ]);

      }

  };

  Slick.prototype.refresh = function( initializing ) {

      var _ = this, currentSlide, lastVisibleIndex;

      lastVisibleIndex = _.slideCount - _.options.slidesToShow;

      // in non-infinite sliders, we don't want to go past the
      // last visible index.
      if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
          _.currentSlide = lastVisibleIndex;
      }

      // if less slides than to show, go to start.
      if ( _.slideCount <= _.options.slidesToShow ) {
          _.currentSlide = 0;

      }

      currentSlide = _.currentSlide;

      _.destroy(true);

      $.extend(_, _.initials, { currentSlide: currentSlide });

      _.init();

      if( !initializing ) {

          _.changeSlide({
              data: {
                  message: 'index',
                  index: currentSlide
              }
          }, false);

      }

  };

  Slick.prototype.registerBreakpoints = function() {

      var _ = this, breakpoint, currentBreakpoint, l,
          responsiveSettings = _.options.responsive || null;

      if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

          _.respondTo = _.options.respondTo || 'window';

          for ( breakpoint in responsiveSettings ) {

              l = _.breakpoints.length-1;

              if (responsiveSettings.hasOwnProperty(breakpoint)) {
                  currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                  // loop through the breakpoints and cut out any existing
                  // ones with the same breakpoint number, we don't want dupes.
                  while( l >= 0 ) {
                      if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                          _.breakpoints.splice(l,1);
                      }
                      l--;
                  }

                  _.breakpoints.push(currentBreakpoint);
                  _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

              }

          }

          _.breakpoints.sort(function(a, b) {
              return ( _.options.mobileFirst ) ? a-b : b-a;
          });

      }

  };

  Slick.prototype.reinit = function() {

      var _ = this;

      _.$slides =
          _.$slideTrack
              .children(_.options.slide)
              .addClass('slick-slide');

      _.slideCount = _.$slides.length;

      if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
          _.currentSlide = _.currentSlide - _.options.slidesToScroll;
      }

      if (_.slideCount <= _.options.slidesToShow) {
          _.currentSlide = 0;
      }

      _.registerBreakpoints();

      _.setProps();
      _.setupInfinite();
      _.buildArrows();
      _.updateArrows();
      _.initArrowEvents();
      _.buildDots();
      _.updateDots();
      _.initDotEvents();
      _.cleanUpSlideEvents();
      _.initSlideEvents();

      _.checkResponsive(false, true);

      if (_.options.focusOnSelect === true) {
          $(_.$slideTrack).children().on('click.slick', _.selectHandler);
      }

      _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

      _.setPosition();
      _.focusHandler();

      _.paused = !_.options.autoplay;
      _.autoPlay();

      _.$slider.trigger('reInit', [_]);

  };

  Slick.prototype.resize = function() {

      var _ = this;

      if ($(window).width() !== _.windowWidth) {
          clearTimeout(_.windowDelay);
          _.windowDelay = window.setTimeout(function() {
              _.windowWidth = $(window).width();
              _.checkResponsive();
              if( !_.unslicked ) { _.setPosition(); }
          }, 50);
      }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

      var _ = this;

      if (typeof(index) === 'boolean') {
          removeBefore = index;
          index = removeBefore === true ? 0 : _.slideCount - 1;
      } else {
          index = removeBefore === true ? --index : index;
      }

      if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
          return false;
      }

      _.unload();

      if (removeAll === true) {
          _.$slideTrack.children().remove();
      } else {
          _.$slideTrack.children(this.options.slide).eq(index).remove();
      }

      _.$slides = _.$slideTrack.children(this.options.slide);

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.append(_.$slides);

      _.$slidesCache = _.$slides;

      _.reinit();

  };

  Slick.prototype.setCSS = function(position) {

      var _ = this,
          positionProps = {},
          x, y;

      if (_.options.rtl === true) {
          position = -position;
      }
      x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
      y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

      positionProps[_.positionProp] = position;

      if (_.transformsEnabled === false) {
          _.$slideTrack.css(positionProps);
      } else {
          positionProps = {};
          if (_.cssTransitions === false) {
              positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
              _.$slideTrack.css(positionProps);
          } else {
              positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
              _.$slideTrack.css(positionProps);
          }
      }

  };

  Slick.prototype.setDimensions = function() {

      var _ = this;

      if (_.options.vertical === false) {
          if (_.options.centerMode === true) {
              _.$list.css({
                  padding: ('0px ' + _.options.centerPadding)
              });
          }
      } else {
          _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
          if (_.options.centerMode === true) {
              _.$list.css({
                  padding: (_.options.centerPadding + ' 0px')
              });
          }
      }

      _.listWidth = _.$list.width();
      _.listHeight = _.$list.height();


      if (_.options.vertical === false && _.options.variableWidth === false) {
          _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
          _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

      } else if (_.options.variableWidth === true) {
          _.$slideTrack.width(5000 * _.slideCount);
      } else {
          _.slideWidth = Math.ceil(_.listWidth);
          _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
      }

      var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
      if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

  };

  Slick.prototype.setFade = function() {

      var _ = this,
          targetLeft;

      _.$slides.each(function(index, element) {
          targetLeft = (_.slideWidth * index) * -1;
          if (_.options.rtl === true) {
              $(element).css({
                  position: 'relative',
                  right: targetLeft,
                  top: 0,
                  zIndex: _.options.zIndex - 2,
                  opacity: 0
              });
          } else {
              $(element).css({
                  position: 'relative',
                  left: targetLeft,
                  top: 0,
                  zIndex: _.options.zIndex - 2,
                  opacity: 0
              });
          }
      });

      _.$slides.eq(_.currentSlide).css({
          zIndex: _.options.zIndex - 1,
          opacity: 1
      });

  };

  Slick.prototype.setHeight = function() {

      var _ = this;

      if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
          var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
          _.$list.css('height', targetHeight);
      }

  };

  Slick.prototype.setOption =
  Slick.prototype.slickSetOption = function() {

      /**
       * accepts arguments in format of:
       *
       *  - for changing a single option's value:
       *     .slick("setOption", option, value, refresh )
       *
       *  - for changing a set of responsive options:
       *     .slick("setOption", 'responsive', [{}, ...], refresh )
       *
       *  - for updating multiple values at once (not responsive)
       *     .slick("setOption", { 'option': value, ... }, refresh )
       */

      var _ = this, l, item, option, value, refresh = false, type;

      if( $.type( arguments[0] ) === 'object' ) {

          option =  arguments[0];
          refresh = arguments[1];
          type = 'multiple';

      } else if ( $.type( arguments[0] ) === 'string' ) {

          option =  arguments[0];
          value = arguments[1];
          refresh = arguments[2];

          if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

              type = 'responsive';

          } else if ( typeof arguments[1] !== 'undefined' ) {

              type = 'single';

          }

      }

      if ( type === 'single' ) {

          _.options[option] = value;


      } else if ( type === 'multiple' ) {

          $.each( option , function( opt, val ) {

              _.options[opt] = val;

          });


      } else if ( type === 'responsive' ) {

          for ( item in value ) {

              if( $.type( _.options.responsive ) !== 'array' ) {

                  _.options.responsive = [ value[item] ];

              } else {

                  l = _.options.responsive.length-1;

                  // loop through the responsive object and splice out duplicates.
                  while( l >= 0 ) {

                      if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                          _.options.responsive.splice(l,1);

                      }

                      l--;

                  }

                  _.options.responsive.push( value[item] );

              }

          }

      }

      if ( refresh ) {

          _.unload();
          _.reinit();

      }

  };

  Slick.prototype.setPosition = function() {

      var _ = this;

      _.setDimensions();

      _.setHeight();

      if (_.options.fade === false) {
          _.setCSS(_.getLeft(_.currentSlide));
      } else {
          _.setFade();
      }

      _.$slider.trigger('setPosition', [_]);

  };

  Slick.prototype.setProps = function() {

      var _ = this,
          bodyStyle = document.body.style;

      _.positionProp = _.options.vertical === true ? 'top' : 'left';

      if (_.positionProp === 'top') {
          _.$slider.addClass('slick-vertical');
      } else {
          _.$slider.removeClass('slick-vertical');
      }

      if (bodyStyle.WebkitTransition !== undefined ||
          bodyStyle.MozTransition !== undefined ||
          bodyStyle.msTransition !== undefined) {
          if (_.options.useCSS === true) {
              _.cssTransitions = true;
          }
      }

      if ( _.options.fade ) {
          if ( typeof _.options.zIndex === 'number' ) {
              if( _.options.zIndex < 3 ) {
                  _.options.zIndex = 3;
              }
          } else {
              _.options.zIndex = _.defaults.zIndex;
          }
      }

      if (bodyStyle.OTransform !== undefined) {
          _.animType = 'OTransform';
          _.transformType = '-o-transform';
          _.transitionType = 'OTransition';
          if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
      }
      if (bodyStyle.MozTransform !== undefined) {
          _.animType = 'MozTransform';
          _.transformType = '-moz-transform';
          _.transitionType = 'MozTransition';
          if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
      }
      if (bodyStyle.webkitTransform !== undefined) {
          _.animType = 'webkitTransform';
          _.transformType = '-webkit-transform';
          _.transitionType = 'webkitTransition';
          if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
      }
      if (bodyStyle.msTransform !== undefined) {
          _.animType = 'msTransform';
          _.transformType = '-ms-transform';
          _.transitionType = 'msTransition';
          if (bodyStyle.msTransform === undefined) _.animType = false;
      }
      if (bodyStyle.transform !== undefined && _.animType !== false) {
          _.animType = 'transform';
          _.transformType = 'transform';
          _.transitionType = 'transition';
      }
      _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
  };


  Slick.prototype.setSlideClasses = function(index) {

      var _ = this,
          centerOffset, allSlides, indexOffset, remainder;

      allSlides = _.$slider
          .find('.slick-slide')
          .removeClass('slick-active slick-center slick-current')
          .attr('aria-hidden', 'true');

      _.$slides
          .eq(index)
          .addClass('slick-current');

      if (_.options.centerMode === true) {

          var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

          centerOffset = Math.floor(_.options.slidesToShow / 2);

          if (_.options.infinite === true) {

              if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                  _.$slides
                      .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                      .addClass('slick-active')
                      .attr('aria-hidden', 'false');

              } else {

                  indexOffset = _.options.slidesToShow + index;
                  allSlides
                      .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                      .addClass('slick-active')
                      .attr('aria-hidden', 'false');

              }

              if (index === 0) {

                  allSlides
                      .eq(allSlides.length - 1 - _.options.slidesToShow)
                      .addClass('slick-center');

              } else if (index === _.slideCount - 1) {

                  allSlides
                      .eq(_.options.slidesToShow)
                      .addClass('slick-center');

              }

          }

          _.$slides
              .eq(index)
              .addClass('slick-center');

      } else {

          if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

              _.$slides
                  .slice(index, index + _.options.slidesToShow)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false');

          } else if (allSlides.length <= _.options.slidesToShow) {

              allSlides
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false');

          } else {

              remainder = _.slideCount % _.options.slidesToShow;
              indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

              if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                  allSlides
                      .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                      .addClass('slick-active')
                      .attr('aria-hidden', 'false');

              } else {

                  allSlides
                      .slice(indexOffset, indexOffset + _.options.slidesToShow)
                      .addClass('slick-active')
                      .attr('aria-hidden', 'false');

              }

          }

      }

      if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
          _.lazyLoad();
      }
  };

  Slick.prototype.setupInfinite = function() {

      var _ = this,
          i, slideIndex, infiniteCount;

      if (_.options.fade === true) {
          _.options.centerMode = false;
      }

      if (_.options.infinite === true && _.options.fade === false) {

          slideIndex = null;

          if (_.slideCount > _.options.slidesToShow) {

              if (_.options.centerMode === true) {
                  infiniteCount = _.options.slidesToShow + 1;
              } else {
                  infiniteCount = _.options.slidesToShow;
              }

              for (i = _.slideCount; i > (_.slideCount -
                      infiniteCount); i -= 1) {
                  slideIndex = i - 1;
                  $(_.$slides[slideIndex]).clone(true).attr('id', '')
                      .attr('data-slick-index', slideIndex - _.slideCount)
                      .prependTo(_.$slideTrack).addClass('slick-cloned');
              }
              for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
                  slideIndex = i;
                  $(_.$slides[slideIndex]).clone(true).attr('id', '')
                      .attr('data-slick-index', slideIndex + _.slideCount)
                      .appendTo(_.$slideTrack).addClass('slick-cloned');
              }
              _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                  $(this).attr('id', '');
              });

          }

      }

  };

  Slick.prototype.interrupt = function( toggle ) {

      var _ = this;

      if( !toggle ) {
          _.autoPlay();
      }
      _.interrupted = toggle;

  };

  Slick.prototype.selectHandler = function(event) {

      var _ = this;

      var targetElement =
          $(event.target).is('.slick-slide') ?
              $(event.target) :
              $(event.target).parents('.slick-slide');

      var index = parseInt(targetElement.attr('data-slick-index'));

      if (!index) index = 0;

      if (_.slideCount <= _.options.slidesToShow) {

          _.slideHandler(index, false, true);
          return;

      }

      _.slideHandler(index);

  };

  Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

      var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
          _ = this, navTarget;

      sync = sync || false;

      if (_.animating === true && _.options.waitForAnimate === true) {
          return;
      }

      if (_.options.fade === true && _.currentSlide === index) {
          return;
      }

      if (sync === false) {
          _.asNavFor(index);
      }

      targetSlide = index;
      targetLeft = _.getLeft(targetSlide);
      slideLeft = _.getLeft(_.currentSlide);

      _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

      if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
          if (_.options.fade === false) {
              targetSlide = _.currentSlide;
              if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                  _.animateSlide(slideLeft, function() {
                      _.postSlide(targetSlide);
                  });
              } else {
                  _.postSlide(targetSlide);
              }
          }
          return;
      } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
          if (_.options.fade === false) {
              targetSlide = _.currentSlide;
              if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                  _.animateSlide(slideLeft, function() {
                      _.postSlide(targetSlide);
                  });
              } else {
                  _.postSlide(targetSlide);
              }
          }
          return;
      }

      if ( _.options.autoplay ) {
          clearInterval(_.autoPlayTimer);
      }

      if (targetSlide < 0) {
          if (_.slideCount % _.options.slidesToScroll !== 0) {
              animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
          } else {
              animSlide = _.slideCount + targetSlide;
          }
      } else if (targetSlide >= _.slideCount) {
          if (_.slideCount % _.options.slidesToScroll !== 0) {
              animSlide = 0;
          } else {
              animSlide = targetSlide - _.slideCount;
          }
      } else {
          animSlide = targetSlide;
      }

      _.animating = true;

      _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

      oldSlide = _.currentSlide;
      _.currentSlide = animSlide;

      _.setSlideClasses(_.currentSlide);

      if ( _.options.asNavFor ) {

          navTarget = _.getNavTarget();
          navTarget = navTarget.slick('getSlick');

          if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
              navTarget.setSlideClasses(_.currentSlide);
          }

      }

      _.updateDots();
      _.updateArrows();

      if (_.options.fade === true) {
          if (dontAnimate !== true) {

              _.fadeSlideOut(oldSlide);

              _.fadeSlide(animSlide, function() {
                  _.postSlide(animSlide);
              });

          } else {
              _.postSlide(animSlide);
          }
          _.animateHeight();
          return;
      }

      if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(targetLeft, function() {
              _.postSlide(animSlide);
          });
      } else {
          _.postSlide(animSlide);
      }

  };

  Slick.prototype.startLoad = function() {

      var _ = this;

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

          _.$prevArrow.hide();
          _.$nextArrow.hide();

      }

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

          _.$dots.hide();

      }

      _.$slider.addClass('slick-loading');

  };

  Slick.prototype.swipeDirection = function() {

      var xDist, yDist, r, swipeAngle, _ = this;

      xDist = _.touchObject.startX - _.touchObject.curX;
      yDist = _.touchObject.startY - _.touchObject.curY;
      r = Math.atan2(yDist, xDist);

      swipeAngle = Math.round(r * 180 / Math.PI);
      if (swipeAngle < 0) {
          swipeAngle = 360 - Math.abs(swipeAngle);
      }

      if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
          return (_.options.rtl === false ? 'left' : 'right');
      }
      if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
          return (_.options.rtl === false ? 'left' : 'right');
      }
      if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
          return (_.options.rtl === false ? 'right' : 'left');
      }
      if (_.options.verticalSwiping === true) {
          if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
              return 'down';
          } else {
              return 'up';
          }
      }

      return 'vertical';

  };

  Slick.prototype.swipeEnd = function(event) {

      var _ = this,
          slideCount,
          direction;

      _.dragging = false;
      _.swiping = false;

      if (_.scrolling) {
          _.scrolling = false;
          return false;
      }

      _.interrupted = false;
      _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

      if ( _.touchObject.curX === undefined ) {
          return false;
      }

      if ( _.touchObject.edgeHit === true ) {
          _.$slider.trigger('edge', [_, _.swipeDirection() ]);
      }

      if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

          direction = _.swipeDirection();

          switch ( direction ) {

              case 'left':
              case 'down':

                  slideCount =
                      _.options.swipeToSlide ?
                          _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                          _.currentSlide + _.getSlideCount();

                  _.currentDirection = 0;

                  break;

              case 'right':
              case 'up':

                  slideCount =
                      _.options.swipeToSlide ?
                          _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                          _.currentSlide - _.getSlideCount();

                  _.currentDirection = 1;

                  break;

              default:


          }

          if( direction != 'vertical' ) {

              _.slideHandler( slideCount );
              _.touchObject = {};
              _.$slider.trigger('swipe', [_, direction ]);

          }

      } else {

          if ( _.touchObject.startX !== _.touchObject.curX ) {

              _.slideHandler( _.currentSlide );
              _.touchObject = {};

          }

      }

  };

  Slick.prototype.swipeHandler = function(event) {

      var _ = this;

      if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
          return;
      } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
          return;
      }

      _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
          event.originalEvent.touches.length : 1;

      _.touchObject.minSwipe = _.listWidth / _.options
          .touchThreshold;

      if (_.options.verticalSwiping === true) {
          _.touchObject.minSwipe = _.listHeight / _.options
              .touchThreshold;
      }

      switch (event.data.action) {

          case 'start':
              _.swipeStart(event);
              break;

          case 'move':
              _.swipeMove(event);
              break;

          case 'end':
              _.swipeEnd(event);
              break;

      }

  };

  Slick.prototype.swipeMove = function(event) {

      var _ = this,
          edgeWasHit = false,
          curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

      touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

      if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
          return false;
      }

      curLeft = _.getLeft(_.currentSlide);

      _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
      _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

      _.touchObject.swipeLength = Math.round(Math.sqrt(
          Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

      verticalSwipeLength = Math.round(Math.sqrt(
          Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

      if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
          _.scrolling = true;
          return false;
      }

      if (_.options.verticalSwiping === true) {
          _.touchObject.swipeLength = verticalSwipeLength;
      }

      swipeDirection = _.swipeDirection();

      if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
          _.swiping = true;
          event.preventDefault();
      }

      positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
      if (_.options.verticalSwiping === true) {
          positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
      }


      swipeLength = _.touchObject.swipeLength;

      _.touchObject.edgeHit = false;

      if (_.options.infinite === false) {
          if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
              swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
              _.touchObject.edgeHit = true;
          }
      }

      if (_.options.vertical === false) {
          _.swipeLeft = curLeft + swipeLength * positionOffset;
      } else {
          _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
      }
      if (_.options.verticalSwiping === true) {
          _.swipeLeft = curLeft + swipeLength * positionOffset;
      }

      if (_.options.fade === true || _.options.touchMove === false) {
          return false;
      }

      if (_.animating === true) {
          _.swipeLeft = null;
          return false;
      }

      _.setCSS(_.swipeLeft);

  };

  Slick.prototype.swipeStart = function(event) {

      var _ = this,
          touches;

      _.interrupted = true;

      if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
          _.touchObject = {};
          return false;
      }

      if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
          touches = event.originalEvent.touches[0];
      }

      _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
      _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

      _.dragging = true;

  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

      var _ = this;

      if (_.$slidesCache !== null) {

          _.unload();

          _.$slideTrack.children(this.options.slide).detach();

          _.$slidesCache.appendTo(_.$slideTrack);

          _.reinit();

      }

  };

  Slick.prototype.unload = function() {

      var _ = this;

      $('.slick-cloned', _.$slider).remove();

      if (_.$dots) {
          _.$dots.remove();
      }

      if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.remove();
      }

      if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.remove();
      }

      _.$slides
          .removeClass('slick-slide slick-active slick-visible slick-current')
          .attr('aria-hidden', 'true')
          .css('width', '');

  };

  Slick.prototype.unslick = function(fromBreakpoint) {

      var _ = this;
      _.$slider.trigger('unslick', [_, fromBreakpoint]);
      _.destroy();

  };

  Slick.prototype.updateArrows = function() {

      var _ = this,
          centerOffset;

      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if ( _.options.arrows === true &&
          _.slideCount > _.options.slidesToShow &&
          !_.options.infinite ) {

          _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
          _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

          if (_.currentSlide === 0) {

              _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
              _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

          } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

              _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
              _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

          } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

              _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
              _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

          }

      }

  };

  Slick.prototype.updateDots = function() {

      var _ = this;

      if (_.$dots !== null) {

          _.$dots
              .find('li')
                  .removeClass('slick-active')
                  .end();

          _.$dots
              .find('li')
              .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
              .addClass('slick-active');

      }

  };

  Slick.prototype.visibility = function() {

      var _ = this;

      if ( _.options.autoplay ) {

          if ( document[_.hidden] ) {

              _.interrupted = true;

          } else {

              _.interrupted = false;

          }

      }

  };

  $.fn.slick = function() {
      var _ = this,
          opt = arguments[0],
          args = Array.prototype.slice.call(arguments, 1),
          l = _.length,
          i,
          ret;
      for (i = 0; i < l; i++) {
          if (typeof opt == 'object' || typeof opt == 'undefined')
              _[i].slick = new Slick(_[i], opt);
          else
              ret = _[i].slick[opt].apply(_[i].slick, args);
          if (typeof ret != 'undefined') return ret;
      }
      return _;
  };

}));
/*!
 * sly 1.6.1 - 8th Aug 2015
 * https://github.com/darsain/sly
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */

;(function ($, w, undefined) {
	'use strict';

	var pluginName = 'sly';
	var className  = 'Sly';
	var namespace  = pluginName;

	// Local WindowAnimationTiming interface
	var cAF = w.cancelAnimationFrame || w.cancelRequestAnimationFrame;
	var rAF = w.requestAnimationFrame;

	// Support indicators
	var transform, gpuAcceleration;

	// Other global values
	var $doc = $(document);
	var dragInitEvents = 'touchstart.' + namespace + ' mousedown.' + namespace;
	var dragMouseEvents = 'mousemove.' + namespace + ' mouseup.' + namespace;
	var dragTouchEvents = 'touchmove.' + namespace + ' touchend.' + namespace;
	var wheelEvent = (document.implementation.hasFeature('Event.wheel', '3.0') ? 'wheel.' : 'mousewheel.') + namespace;
	var clickEvent = 'click.' + namespace;
	var mouseDownEvent = 'mousedown.' + namespace;
	var interactiveElements = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'];
	var tmpArray = [];
	var time;

	// Math shorthands
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var pow = Math.pow;
	var round = Math.round;
	var max = Math.max;
	var min = Math.min;

	// Keep track of last fired global wheel event
	var lastGlobalWheel = 0;
	$doc.on(wheelEvent, function (event) {
		var sly = event.originalEvent[namespace];
		var time = +new Date();
		// Update last global wheel time, but only when event didn't originate
		// in Sly frame, or the origin was less than scrollHijack time ago
		if (!sly || sly.options.scrollHijack < time - lastGlobalWheel) lastGlobalWheel = time;
	});

	/**
	 * Sly.
	 *
	 * @class
	 *
	 * @param {Element} frame       DOM element of sly container.
	 * @param {Object}  options     Object with options.
	 * @param {Object}  callbackMap Callbacks map.
	 */
	function Sly(frame, options, callbackMap) {
		if (!(this instanceof Sly)) return new Sly(frame, options, callbackMap);

		// Extend options
		var o = $.extend({}, Sly.defaults, options);

		// Private variables
		var self = this;
		var parallax = isNumber(frame);

		// Frame
		var $frame = $(frame);
		var $slidee = o.slidee ? $(o.slidee).eq(0) : $frame.children().eq(0);
		var frameSize = 0;
		var slideeSize = 0;
		var pos = {
			start: 0,
			center: 0,
			end: 0,
			cur: 0,
			dest: 0
		};

		// Scrollbar
		var $sb = $(o.scrollBar).eq(0);
		var $handle = $sb.children().eq(0);
		var sbSize = 0;
		var handleSize = 0;
		var hPos = {
			start: 0,
			end: 0,
			cur: 0
		};

		// Pagesbar
		var $pb = $(o.pagesBar);
		var $pages = 0;
		var pages = [];

		// Items
		var $items = 0;
		var items = [];
		var rel = {
			firstItem: 0,
			lastItem: 0,
			centerItem: 0,
			activeItem: null,
			activePage: 0
		};

		// Styles
		var frameStyles = new StyleRestorer($frame[0]);
		var slideeStyles = new StyleRestorer($slidee[0]);
		var sbStyles = new StyleRestorer($sb[0]);
		var handleStyles = new StyleRestorer($handle[0]);

		// Navigation type booleans
		var basicNav = o.itemNav === 'basic';
		var forceCenteredNav = o.itemNav === 'forceCentered';
		var centeredNav = o.itemNav === 'centered' || forceCenteredNav;
		var itemNav = !parallax && (basicNav || centeredNav || forceCenteredNav);

		// Miscellaneous
		var $scrollSource = o.scrollSource ? $(o.scrollSource) : $frame;
		var $dragSource = o.dragSource ? $(o.dragSource) : $frame;
		var $forwardButton = $(o.forward);
		var $backwardButton = $(o.backward);
		var $prevButton = $(o.prev);
		var $nextButton = $(o.next);
		var $prevPageButton = $(o.prevPage);
		var $nextPageButton = $(o.nextPage);
		var callbacks = {};
		var last = {};
		var animation = {};
		var move = {};
		var dragging = {
			released: 1
		};
		var scrolling = {
			last: 0,
			delta: 0,
			resetTime: 200
		};
		var renderID = 0;
		var historyID = 0;
		var cycleID = 0;
		var continuousID = 0;
		var i, l;

		// Normalizing frame
		if (!parallax) {
			frame = $frame[0];
		}

		// Expose properties
		self.initialized = 0;
		self.frame = frame;
		self.slidee = $slidee[0];
		self.pos = pos;
		self.rel = rel;
		self.items = items;
		self.pages = pages;
		self.isPaused = 0;
		self.options = o;
		self.dragging = dragging;

		/**
		 * Loading function.
		 *
		 * Populate arrays, set sizes, bind events, ...
		 *
		 * @param {Boolean} [isInit] Whether load is called from within self.init().
		 * @return {Void}
		 */
		function load(isInit) {
			// Local variables
			var lastItemsCount = 0;
			var lastPagesCount = pages.length;

			// Save old position
			pos.old = $.extend({}, pos);

			// Reset global variables
			frameSize = parallax ? 0 : $frame[o.horizontal ? 'width' : 'height']();
			sbSize = $sb[o.horizontal ? 'width' : 'height']();
			slideeSize = parallax ? frame : $slidee[o.horizontal ? 'outerWidth' : 'outerHeight']();
			pages.length = 0;

			// Set position limits & relatives
			pos.start = 0;
			pos.end = max(slideeSize - frameSize, 0);

			// Sizes & offsets for item based navigations
			if (itemNav) {
				// Save the number of current items
				lastItemsCount = items.length;

				// Reset itemNav related variables
				$items = $slidee.children(o.itemSelector);
				items.length = 0;

				// Needed variables
				var paddingStart = getPx($slidee, o.horizontal ? 'paddingLeft' : 'paddingTop');
				var paddingEnd = getPx($slidee, o.horizontal ? 'paddingRight' : 'paddingBottom');
				var borderBox = $($items).css('boxSizing') === 'border-box';
				var areFloated = $items.css('float') !== 'none';
				var ignoredMargin = 0;
				var lastItemIndex = $items.length - 1;
				var lastItem;

				// Reset slideeSize
				slideeSize = 0;

				// Iterate through items
				$items.each(function (i, element) {
					// Item
					var $item = $(element);
					var rect = element.getBoundingClientRect();
					var itemSize = round(o.horizontal ? rect.width || rect.right - rect.left : rect.height || rect.bottom - rect.top);
					var itemMarginStart = getPx($item, o.horizontal ? 'marginLeft' : 'marginTop');
					var itemMarginEnd = getPx($item, o.horizontal ? 'marginRight' : 'marginBottom');
					var itemSizeFull = itemSize + itemMarginStart + itemMarginEnd;
					var singleSpaced = !itemMarginStart || !itemMarginEnd;
					var item = {};
					item.el = element;
					item.size = singleSpaced ? itemSize : itemSizeFull;
					item.half = item.size / 2;
					item.start = slideeSize + (singleSpaced ? itemMarginStart : 0);
					item.center = item.start - round(frameSize / 2 - item.size / 2);
					item.end = item.start - frameSize + item.size;

					// Account for slidee padding
					if (!i) {
						slideeSize += paddingStart;
					}

					// Increment slidee size for size of the active element
					slideeSize += itemSizeFull;

					// Try to account for vertical margin collapsing in vertical mode
					// It's not bulletproof, but should work in 99% of cases
					if (!o.horizontal && !areFloated) {
						// Subtract smaller margin, but only when top margin is not 0, and this is not the first element
						if (itemMarginEnd && itemMarginStart && i > 0) {
							slideeSize -= min(itemMarginStart, itemMarginEnd);
						}
					}

					// Things to be done on last item
					if (i === lastItemIndex) {
						item.end += paddingEnd;
						slideeSize += paddingEnd;
						ignoredMargin = singleSpaced ? itemMarginEnd : 0;
					}

					// Add item object to items array
					items.push(item);
					lastItem = item;
				});

				// Resize SLIDEE to fit all items
				$slidee[0].style[o.horizontal ? 'width' : 'height'] = (borderBox ? slideeSize: slideeSize - paddingStart - paddingEnd) + 'px';

				// Adjust internal SLIDEE size for last margin
				slideeSize -= ignoredMargin;

				// Set limits
				if (items.length) {
					pos.start =  items[0][forceCenteredNav ? 'center' : 'start'];
					pos.end = forceCenteredNav ? lastItem.center : frameSize < slideeSize ? lastItem.end : pos.start;
				} else {
					pos.start = pos.end = 0;
				}
			}

			// Calculate SLIDEE center position
			pos.center = round(pos.end / 2 + pos.start / 2);

			// Update relative positions
			updateRelatives();

			// Scrollbar
			if ($handle.length && sbSize > 0) {
				// Stretch scrollbar handle to represent the visible area
				if (o.dynamicHandle) {
					handleSize = pos.start === pos.end ? sbSize : round(sbSize * frameSize / slideeSize);
					handleSize = within(handleSize, o.minHandleSize, sbSize);
					$handle[0].style[o.horizontal ? 'width' : 'height'] = handleSize + 'px';
				} else {
					handleSize = $handle[o.horizontal ? 'outerWidth' : 'outerHeight']();
				}

				hPos.end = sbSize - handleSize;

				if (!renderID) {
					syncScrollbar();
				}
			}

			// Pages
			if (!parallax && frameSize > 0) {
				var tempPagePos = pos.start;
				var pagesHtml = '';

				// Populate pages array
				if (itemNav) {
					$.each(items, function (i, item) {
						if (forceCenteredNav) {
							pages.push(item.center);
						} else if (item.start + item.size > tempPagePos && tempPagePos <= pos.end) {
							tempPagePos = item.start;
							pages.push(tempPagePos);
							tempPagePos += frameSize;
							if (tempPagePos > pos.end && tempPagePos < pos.end + frameSize) {
								pages.push(pos.end);
							}
						}
					});
				} else {
					while (tempPagePos - frameSize < pos.end) {
						pages.push(tempPagePos);
						tempPagePos += frameSize;
					}
				}

				// Pages bar
				if ($pb[0] && lastPagesCount !== pages.length) {
					for (var i = 0; i < pages.length; i++) {
						pagesHtml += o.pageBuilder.call(self, i);
					}
					$pages = $pb.html(pagesHtml).children();
					$pages.eq(rel.activePage).addClass(o.activeClass);
				}
			}

			// Extend relative variables object with some useful info
			rel.slideeSize = slideeSize;
			rel.frameSize = frameSize;
			rel.sbSize = sbSize;
			rel.handleSize = handleSize;

			// Activate requested position
			if (itemNav) {
				if (isInit && o.startAt != null) {
					activate(o.startAt);
					self[centeredNav ? 'toCenter' : 'toStart'](o.startAt);
				}
				// Fix possible overflowing
				var activeItem = items[rel.activeItem];
				slideTo(centeredNav && activeItem ? activeItem.center : within(pos.dest, pos.start, pos.end));
			} else {
				if (isInit) {
					if (o.startAt != null) slideTo(o.startAt, 1);
				} else {
					// Fix possible overflowing
					slideTo(within(pos.dest, pos.start, pos.end));
				}
			}

			// Trigger load event
			trigger('load');
		}
		self.reload = function () { load(); };

		/**
		 * Animate to a position.
		 *
		 * @param {Int}  newPos    New position.
		 * @param {Bool} immediate Reposition immediately without an animation.
		 * @param {Bool} dontAlign Do not align items, use the raw position passed in first argument.
		 *
		 * @return {Void}
		 */
		function slideTo(newPos, immediate, dontAlign) {
			// Align items
			if (itemNav && dragging.released && !dontAlign) {
				var tempRel = getRelatives(newPos);
				var isNotBordering = newPos > pos.start && newPos < pos.end;

				if (centeredNav) {
					if (isNotBordering) {
						newPos = items[tempRel.centerItem].center;
					}
					if (forceCenteredNav && o.activateMiddle) {
						activate(tempRel.centerItem);
					}
				} else if (isNotBordering) {
					newPos = items[tempRel.firstItem].start;
				}
			}

			// Handle overflowing position limits
			if (dragging.init && dragging.slidee && o.elasticBounds) {
				if (newPos > pos.end) {
					newPos = pos.end + (newPos - pos.end) / 6;
				} else if (newPos < pos.start) {
					newPos = pos.start + (newPos - pos.start) / 6;
				}
			} else {
				newPos = within(newPos, pos.start, pos.end);
			}

			// Update the animation object
			animation.start = +new Date();
			animation.time = 0;
			animation.from = pos.cur;
			animation.to = newPos;
			animation.delta = newPos - pos.cur;
			animation.tweesing = dragging.tweese || dragging.init && !dragging.slidee;
			animation.immediate = !animation.tweesing && (immediate || dragging.init && dragging.slidee || !o.speed);

			// Reset dragging tweesing request
			dragging.tweese = 0;

			// Start animation rendering
			if (newPos !== pos.dest) {
				pos.dest = newPos;
				trigger('change');
				if (!renderID) {
					render();
				}
			}

			// Reset next cycle timeout
			resetCycle();

			// Synchronize states
			updateRelatives();
			updateButtonsState();
			syncPagesbar();
		}

		/**
		 * Render animation frame.
		 *
		 * @return {Void}
		 */
		function render() {
			if (!self.initialized) {
				return;
			}

			// If first render call, wait for next animationFrame
			if (!renderID) {
				renderID = rAF(render);
				if (dragging.released) {
					trigger('moveStart');
				}
				return;
			}

			// If immediate repositioning is requested, don't animate.
			if (animation.immediate) {
				pos.cur = animation.to;
			}
			// Use tweesing for animations without known end point
			else if (animation.tweesing) {
				animation.tweeseDelta = animation.to - pos.cur;
				// Fuck Zeno's paradox
				if (abs(animation.tweeseDelta) < 0.1) {
					pos.cur = animation.to;
				} else {
					pos.cur += animation.tweeseDelta * (dragging.released ? o.swingSpeed : o.syncSpeed);
				}
			}
			// Use tweening for basic animations with known end point
			else {
				animation.time = min(+new Date() - animation.start, o.speed);
				pos.cur = animation.from + animation.delta * $.easing[o.easing](animation.time/o.speed, animation.time, 0, 1, o.speed);
			}

			// If there is nothing more to render break the rendering loop, otherwise request new animation frame.
			if (animation.to === pos.cur) {
				pos.cur = animation.to;
				dragging.tweese = renderID = 0;
			} else {
				renderID = rAF(render);
			}

			trigger('move');

			// Update SLIDEE position
			if (!parallax) {
				if (transform) {
					$slidee[0].style[transform] = gpuAcceleration + (o.horizontal ? 'translateX' : 'translateY') + '(' + (-pos.cur) + 'px)';
				} else {
					$slidee[0].style[o.horizontal ? 'left' : 'top'] = -round(pos.cur) + 'px';
				}
			}

			// When animation reached the end, and dragging is not active, trigger moveEnd
			if (!renderID && dragging.released) {
				trigger('moveEnd');
			}

			syncScrollbar();
		}

		/**
		 * Synchronizes scrollbar with the SLIDEE.
		 *
		 * @return {Void}
		 */
		function syncScrollbar() {
			if ($handle.length) {
				hPos.cur = pos.start === pos.end ? 0 : (((dragging.init && !dragging.slidee) ? pos.dest : pos.cur) - pos.start) / (pos.end - pos.start) * hPos.end;
				hPos.cur = within(round(hPos.cur), hPos.start, hPos.end);
				if (last.hPos !== hPos.cur) {
					last.hPos = hPos.cur;
					if (transform) {
						$handle[0].style[transform] = gpuAcceleration + (o.horizontal ? 'translateX' : 'translateY') + '(' + hPos.cur + 'px)';
					} else {
						$handle[0].style[o.horizontal ? 'left' : 'top'] = hPos.cur + 'px';
					}
				}
			}
		}

		/**
		 * Synchronizes pagesbar with SLIDEE.
		 *
		 * @return {Void}
		 */
		function syncPagesbar() {
			if ($pages[0] && last.page !== rel.activePage) {
				last.page = rel.activePage;
				$pages.removeClass(o.activeClass).eq(rel.activePage).addClass(o.activeClass);
				trigger('activePage', last.page);
			}
		}

		/**
		 * Returns the position object.
		 *
		 * @param {Mixed} item
		 *
		 * @return {Object}
		 */
		self.getPos = function (item) {
			if (itemNav) {
				var index = getIndex(item);
				return index !== -1 ? items[index] : false;
			} else {
				var $item = $slidee.find(item).eq(0);

				if ($item[0]) {
					var offset = o.horizontal ? $item.offset().left - $slidee.offset().left : $item.offset().top - $slidee.offset().top;
					var size = $item[o.horizontal ? 'outerWidth' : 'outerHeight']();

					return {
						start: offset,
						center: offset - frameSize / 2 + size / 2,
						end: offset - frameSize + size,
						size: size
					};
				} else {
					return false;
				}
			}
		};

		/**
		 * Continuous move in a specified direction.
		 *
		 * @param  {Bool} forward True for forward movement, otherwise it'll go backwards.
		 * @param  {Int}  speed   Movement speed in pixels per frame. Overrides options.moveBy value.
		 *
		 * @return {Void}
		 */
		self.moveBy = function (speed) {
			move.speed = speed;
			// If already initiated, or there is nowhere to move, abort
			if (dragging.init || !move.speed || pos.cur === (move.speed > 0 ? pos.end : pos.start)) {
				return;
			}
			// Initiate move object
			move.lastTime = +new Date();
			move.startPos = pos.cur;
			// Set dragging as initiated
			continuousInit('button');
			dragging.init = 1;
			// Start movement
			trigger('moveStart');
			cAF(continuousID);
			moveLoop();
		};

		/**
		 * Continuous movement loop.
		 *
		 * @return {Void}
		 */
		function moveLoop() {
			// If there is nowhere to move anymore, stop
			if (!move.speed || pos.cur === (move.speed > 0 ? pos.end : pos.start)) {
				self.stop();
			}
			// Request new move loop if it hasn't been stopped
			continuousID = dragging.init ? rAF(moveLoop) : 0;
			// Update move object
			move.now = +new Date();
			move.pos = pos.cur + (move.now - move.lastTime) / 1000 * move.speed;
			// Slide
			slideTo(dragging.init ? move.pos : round(move.pos));
			// Normally, this is triggered in render(), but if there
			// is nothing to render, we have to do it manually here.
			if (!dragging.init && pos.cur === pos.dest) {
				trigger('moveEnd');
			}
			// Update times for future iteration
			move.lastTime = move.now;
		}

		/**
		 * Stops continuous movement.
		 *
		 * @return {Void}
		 */
		self.stop = function () {
			if (dragging.source === 'button') {
				dragging.init = 0;
				dragging.released = 1;
			}
		};

		/**
		 * Activate previous item.
		 *
		 * @return {Void}
		 */
		self.prev = function () {
			self.activate(rel.activeItem == null ? 0 : rel.activeItem - 1);
		};

		/**
		 * Activate next item.
		 *
		 * @return {Void}
		 */
		self.next = function () {
			self.activate(rel.activeItem == null ? 0 : rel.activeItem + 1);
		};

		/**
		 * Activate previous page.
		 *
		 * @return {Void}
		 */
		self.prevPage = function () {
			self.activatePage(rel.activePage - 1);
		};

		/**
		 * Activate next page.
		 *
		 * @return {Void}
		 */
		self.nextPage = function () {
			self.activatePage(rel.activePage + 1);
		};

		/**
		 * Slide SLIDEE by amount of pixels.
		 *
		 * @param {Int}  delta     Pixels/Items. Positive means forward, negative means backward.
		 * @param {Bool} immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.slideBy = function (delta, immediate) {
			if (!delta) {
				return;
			}
			if (itemNav) {
				self[centeredNav ? 'toCenter' : 'toStart'](
					within((centeredNav ? rel.centerItem : rel.firstItem) + o.scrollBy * delta, 0, items.length)
				);
			} else {
				slideTo(pos.dest + delta, immediate);
			}
		};

		/**
		 * Animate SLIDEE to a specific position.
		 *
		 * @param {Int}  pos       New position.
		 * @param {Bool} immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.slideTo = function (pos, immediate) {
			slideTo(pos, immediate);
		};

		/**
		 * Core method for handling `toLocation` methods.
		 *
		 * @param  {String} location
		 * @param  {Mixed}  item
		 * @param  {Bool}   immediate
		 *
		 * @return {Void}
		 */
		function to(location, item, immediate) {
			// Optional arguments logic
			if (type(item) === 'boolean') {
				immediate = item;
				item = undefined;
			}

			if (item === undefined) {
				slideTo(pos[location], immediate);
			} else {
				// You can't align items to sides of the frame
				// when centered navigation type is enabled
				if (centeredNav && location !== 'center') {
					return;
				}

				var itemPos = self.getPos(item);
				if (itemPos) {
					slideTo(itemPos[location], immediate, !centeredNav);
				}
			}
		}

		/**
		 * Animate element or the whole SLIDEE to the start of the frame.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
		 * @param {Bool}  immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.toStart = function (item, immediate) {
			to('start', item, immediate);
		};

		/**
		 * Animate element or the whole SLIDEE to the end of the frame.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
		 * @param {Bool}  immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.toEnd = function (item, immediate) {
			to('end', item, immediate);
		};

		/**
		 * Animate element or the whole SLIDEE to the center of the frame.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
		 * @param {Bool}  immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.toCenter = function (item, immediate) {
			to('center', item, immediate);
		};

		/**
		 * Get the index of an item in SLIDEE.
		 *
		 * @param {Mixed} item     Item DOM element.
		 *
		 * @return {Int}  Item index, or -1 if not found.
		 */
		function getIndex(item) {
			return item != null ?
					isNumber(item) ?
						item >= 0 && item < items.length ? item : -1 :
						$items.index(item) :
					-1;
		}
		// Expose getIndex without lowering the compressibility of it,
		// as it is used quite often throughout Sly.
		self.getIndex = getIndex;

		/**
		 * Get index of an item in SLIDEE based on a variety of input types.
		 *
		 * @param  {Mixed} item DOM element, positive or negative integer.
		 *
		 * @return {Int}   Item index, or -1 if not found.
		 */
		function getRelativeIndex(item) {
			return getIndex(isNumber(item) && item < 0 ? item + items.length : item);
		}

		/**
		 * Activates an item.
		 *
		 * @param  {Mixed} item Item DOM element, or index starting at 0.
		 *
		 * @return {Mixed} Activated item index or false on fail.
		 */
		function activate(item, force) {
			var index = getIndex(item);

			if (!itemNav || index < 0) {
				return false;
			}

			// Update classes, last active index, and trigger active event only when there
			// has been a change. Otherwise just return the current active index.
			if (last.active !== index || force) {
				// Update classes
				$items.eq(rel.activeItem).removeClass(o.activeClass);
				$items.eq(index).addClass(o.activeClass);

				last.active = rel.activeItem = index;

				updateButtonsState();
				trigger('active', index);
			}

			return index;
		}

		/**
		 * Activates an item and helps with further navigation when o.smart is enabled.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0.
		 * @param {Bool}  immediate Whether to reposition immediately in smart navigation.
		 *
		 * @return {Void}
		 */
		self.activate = function (item, immediate) {
			var index = activate(item);

			// Smart navigation
			if (o.smart && index !== false) {
				// When centeredNav is enabled, center the element.
				// Otherwise, determine where to position the element based on its current position.
				// If the element is currently on the far end side of the frame, assume that user is
				// moving forward and animate it to the start of the visible frame, and vice versa.
				if (centeredNav) {
					self.toCenter(index, immediate);
				} else if (index >= rel.lastItem) {
					self.toStart(index, immediate);
				} else if (index <= rel.firstItem) {
					self.toEnd(index, immediate);
				} else {
					resetCycle();
				}
			}
		};

		/**
		 * Activates a page.
		 *
		 * @param {Int}  index     Page index, starting from 0.
		 * @param {Bool} immediate Whether to reposition immediately without animation.
		 *
		 * @return {Void}
		 */
		self.activatePage = function (index, immediate) {
			if (isNumber(index)) {
				slideTo(pages[within(index, 0, pages.length - 1)], immediate);
			}
		};

		/**
		 * Return relative positions of items based on their visibility within FRAME.
		 *
		 * @param {Int} slideePos Position of SLIDEE.
		 *
		 * @return {Void}
		 */
		function getRelatives(slideePos) {
			slideePos = within(isNumber(slideePos) ? slideePos : pos.dest, pos.start, pos.end);

			var relatives = {};
			var centerOffset = forceCenteredNav ? 0 : frameSize / 2;

			// Determine active page
			if (!parallax) {
				for (var p = 0, pl = pages.length; p < pl; p++) {
					if (slideePos >= pos.end || p === pages.length - 1) {
						relatives.activePage = pages.length - 1;
						break;
					}

					if (slideePos <= pages[p] + centerOffset) {
						relatives.activePage = p;
						break;
					}
				}
			}

			// Relative item indexes
			if (itemNav) {
				var first = false;
				var last = false;
				var center = false;

				// From start
				for (var i = 0, il = items.length; i < il; i++) {
					// First item
					if (first === false && slideePos <= items[i].start + items[i].half) {
						first = i;
					}

					// Center item
					if (center === false && slideePos <= items[i].center + items[i].half) {
						center = i;
					}

					// Last item
					if (i === il - 1 || slideePos <= items[i].end + items[i].half) {
						last = i;
						break;
					}
				}

				// Safe assignment, just to be sure the false won't be returned
				relatives.firstItem = isNumber(first) ? first : 0;
				relatives.centerItem = isNumber(center) ? center : relatives.firstItem;
				relatives.lastItem = isNumber(last) ? last : relatives.centerItem;
			}

			return relatives;
		}

		/**
		 * Update object with relative positions.
		 *
		 * @param {Int} newPos
		 *
		 * @return {Void}
		 */
		function updateRelatives(newPos) {
			$.extend(rel, getRelatives(newPos));
		}

		/**
		 * Disable navigation buttons when needed.
		 *
		 * Adds disabledClass, and when the button is <button> or <input>, activates :disabled state.
		 *
		 * @return {Void}
		 */
		function updateButtonsState() {
			var isStart = pos.dest <= pos.start;
			var isEnd = pos.dest >= pos.end;
			var slideePosState = (isStart ? 1 : 0) | (isEnd ? 2 : 0);

			// Update paging buttons only if there has been a change in SLIDEE position
			if (last.slideePosState !== slideePosState) {
				last.slideePosState = slideePosState;

				if ($prevPageButton.is('button,input')) {
					$prevPageButton.prop('disabled', isStart);
				}

				if ($nextPageButton.is('button,input')) {
					$nextPageButton.prop('disabled', isEnd);
				}

				$prevPageButton.add($backwardButton)[isStart ? 'addClass' : 'removeClass'](o.disabledClass);
				$nextPageButton.add($forwardButton)[isEnd ? 'addClass' : 'removeClass'](o.disabledClass);
			}

			// Forward & Backward buttons need a separate state caching because we cannot "property disable"
			// them while they are being used, as disabled buttons stop emitting mouse events.
			if (last.fwdbwdState !== slideePosState && dragging.released) {
				last.fwdbwdState = slideePosState;

				if ($backwardButton.is('button,input')) {
					$backwardButton.prop('disabled', isStart);
				}

				if ($forwardButton.is('button,input')) {
					$forwardButton.prop('disabled', isEnd);
				}
			}

			// Item navigation
			if (itemNav && rel.activeItem != null) {
				var isFirst = rel.activeItem === 0;
				var isLast = rel.activeItem >= items.length - 1;
				var itemsButtonState = (isFirst ? 1 : 0) | (isLast ? 2 : 0);

				if (last.itemsButtonState !== itemsButtonState) {
					last.itemsButtonState = itemsButtonState;

					if ($prevButton.is('button,input')) {
						$prevButton.prop('disabled', isFirst);
					}

					if ($nextButton.is('button,input')) {
						$nextButton.prop('disabled', isLast);
					}

					$prevButton[isFirst ? 'addClass' : 'removeClass'](o.disabledClass);
					$nextButton[isLast ? 'addClass' : 'removeClass'](o.disabledClass);
				}
			}
		}

		/**
		 * Resume cycling.
		 *
		 * @param {Int} priority Resume pause with priority lower or equal than this. Used internally for pauseOnHover.
		 *
		 * @return {Void}
		 */
		self.resume = function (priority) {
			if (!o.cycleBy || !o.cycleInterval || o.cycleBy === 'items' && (!items[0] || rel.activeItem == null) || priority < self.isPaused) {
				return;
			}

			self.isPaused = 0;

			if (cycleID) {
				cycleID = clearTimeout(cycleID);
			} else {
				trigger('resume');
			}

			cycleID = setTimeout(function () {
				trigger('cycle');
				switch (o.cycleBy) {
					case 'items':
						self.activate(rel.activeItem >= items.length - 1 ? 0 : rel.activeItem + 1);
						break;

					case 'pages':
						self.activatePage(rel.activePage >= pages.length - 1 ? 0 : rel.activePage + 1);
						break;
				}
			}, o.cycleInterval);
		};

		/**
		 * Pause cycling.
		 *
		 * @param {Int} priority Pause priority. 100 is default. Used internally for pauseOnHover.
		 *
		 * @return {Void}
		 */
		self.pause = function (priority) {
			if (priority < self.isPaused) {
				return;
			}

			self.isPaused = priority || 100;

			if (cycleID) {
				cycleID = clearTimeout(cycleID);
				trigger('pause');
			}
		};

		/**
		 * Toggle cycling.
		 *
		 * @return {Void}
		 */
		self.toggle = function () {
			self[cycleID ? 'pause' : 'resume']();
		};

		/**
		 * Updates a signle or multiple option values.
		 *
		 * @param {Mixed} name  Name of the option that should be updated, or object that will extend the options.
		 * @param {Mixed} value New option value.
		 *
		 * @return {Void}
		 */
		self.set = function (name, value) {
			if ($.isPlainObject(name)) {
				$.extend(o, name);
			} else if (o.hasOwnProperty(name)) {
				o[name] = value;
			}
		};

		/**
		 * Add one or multiple items to the SLIDEE end, or a specified position index.
		 *
		 * @param {Mixed} element Node element, or HTML string.
		 * @param {Int}   index   Index of a new item position. By default item is appended at the end.
		 *
		 * @return {Void}
		 */
		self.add = function (element, index) {
			var $element = $(element);

			if (itemNav) {
				// Insert the element(s)
				if (index == null || !items[0] || index >= items.length) {
					$element.appendTo($slidee);
				} else if (items.length) {
					$element.insertBefore(items[index].el);
				}

				// Adjust the activeItem index
				if (rel.activeItem != null && index <= rel.activeItem) {
					last.active = rel.activeItem += $element.length;
				}
			} else {
				$slidee.append($element);
			}

			// Reload
			load();
		};

		/**
		 * Remove an item from SLIDEE.
		 *
		 * @param {Mixed} element Item index, or DOM element.
		 * @param {Int}   index   Index of a new item position. By default item is appended at the end.
		 *
		 * @return {Void}
		 */
		self.remove = function (element) {
			if (itemNav) {
				var index = getRelativeIndex(element);

				if (index > -1) {
					// Remove the element
					$items.eq(index).remove();

					// If the current item is being removed, activate new one after reload
					var reactivate = index === rel.activeItem;

					// Adjust the activeItem index
					if (rel.activeItem != null && index < rel.activeItem) {
						last.active = --rel.activeItem;
					}

					// Reload
					load();

					// Activate new item at the removed position
					if (reactivate) {
						last.active = null;
						self.activate(rel.activeItem);
					}
				}
			} else {
				$(element).remove();
				load();
			}
		};

		/**
		 * Helps re-arranging items.
		 *
		 * @param  {Mixed} item     Item DOM element, or index starting at 0. Use negative numbers to select items from the end.
		 * @param  {Mixed} position Item insertion anchor. Accepts same input types as item argument.
		 * @param  {Bool}  after    Insert after instead of before the anchor.
		 *
		 * @return {Void}
		 */
		function moveItem(item, position, after) {
			item = getRelativeIndex(item);
			position = getRelativeIndex(position);

			// Move only if there is an actual change requested
			if (item > -1 && position > -1 && item !== position && (!after || position !== item - 1) && (after || position !== item + 1)) {
				$items.eq(item)[after ? 'insertAfter' : 'insertBefore'](items[position].el);

				var shiftStart = item < position ? item : (after ? position : position - 1);
				var shiftEnd = item > position ? item : (after ? position + 1 : position);
				var shiftsUp = item > position;

				// Update activeItem index
				if (rel.activeItem != null) {
					if (item === rel.activeItem) {
						last.active = rel.activeItem = after ? (shiftsUp ? position + 1 : position) : (shiftsUp ? position : position - 1);
					} else if (rel.activeItem > shiftStart && rel.activeItem < shiftEnd) {
						last.active = rel.activeItem += shiftsUp ? 1 : -1;
					}
				}

				// Reload
				load();
			}
		}

		/**
		 * Move item after the target anchor.
		 *
		 * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
		 * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
		 *
		 * @return {Void}
		 */
		self.moveAfter = function (item, position) {
			moveItem(item, position, 1);
		};

		/**
		 * Move item before the target anchor.
		 *
		 * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
		 * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
		 *
		 * @return {Void}
		 */
		self.moveBefore = function (item, position) {
			moveItem(item, position);
		};

		/**
		 * Registers callbacks.
		 *
		 * @param  {Mixed} name  Event name, or callbacks map.
		 * @param  {Mixed} fn    Callback, or an array of callback functions.
		 *
		 * @return {Void}
		 */
		self.on = function (name, fn) {
			// Callbacks map
			if (type(name) === 'object') {
				for (var key in name) {
					if (name.hasOwnProperty(key)) {
						self.on(key, name[key]);
					}
				}
			// Callback
			} else if (type(fn) === 'function') {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (callbackIndex(names[n], fn) === -1) {
						callbacks[names[n]].push(fn);
					}
				}
			// Callbacks array
			} else if (type(fn) === 'array') {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.on(name, fn[f]);
				}
			}
		};

		/**
		 * Registers callbacks to be executed only once.
		 *
		 * @param  {Mixed} name  Event name, or callbacks map.
		 * @param  {Mixed} fn    Callback, or an array of callback functions.
		 *
		 * @return {Void}
		 */
		self.one = function (name, fn) {
			function proxy() {
				fn.apply(self, arguments);
				self.off(name, proxy);
			}
			self.on(name, proxy);
		};

		/**
		 * Remove one or all callbacks.
		 *
		 * @param  {String} name Event name.
		 * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
		 *
		 * @return {Void}
		 */
		self.off = function (name, fn) {
			if (fn instanceof Array) {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.off(name, fn[f]);
				}
			} else {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (fn == null) {
						callbacks[names[n]].length = 0;
					} else {
						var index = callbackIndex(names[n], fn);
						if (index !== -1) {
							callbacks[names[n]].splice(index, 1);
						}
					}
				}
			}
		};

		/**
		 * Returns callback array index.
		 *
		 * @param  {String}   name Event name.
		 * @param  {Function} fn   Function
		 *
		 * @return {Int} Callback array index, or -1 if isn't registered.
		 */
		function callbackIndex(name, fn) {
			for (var i = 0, l = callbacks[name].length; i < l; i++) {
				if (callbacks[name][i] === fn) {
					return i;
				}
			}
			return -1;
		}

		/**
		 * Reset next cycle timeout.
		 *
		 * @return {Void}
		 */
		function resetCycle() {
			if (dragging.released && !self.isPaused) {
				self.resume();
			}
		}

		/**
		 * Calculate SLIDEE representation of handle position.
		 *
		 * @param  {Int} handlePos
		 *
		 * @return {Int}
		 */
		function handleToSlidee(handlePos) {
			return round(within(handlePos, hPos.start, hPos.end) / hPos.end * (pos.end - pos.start)) + pos.start;
		}

		/**
		 * Keeps track of a dragging delta history.
		 *
		 * @return {Void}
		 */
		function draggingHistoryTick() {
			// Looking at this, I know what you're thinking :) But as we need only 4 history states, doing it this way
			// as opposed to a proper loop is ~25 bytes smaller (when minified with GCC), a lot faster, and doesn't
			// generate garbage. The loop version would create 2 new variables on every tick. Unexaptable!
			dragging.history[0] = dragging.history[1];
			dragging.history[1] = dragging.history[2];
			dragging.history[2] = dragging.history[3];
			dragging.history[3] = dragging.delta;
		}

		/**
		 * Initialize continuous movement.
		 *
		 * @return {Void}
		 */
		function continuousInit(source) {
			dragging.released = 0;
			dragging.source = source;
			dragging.slidee = source === 'slidee';
		}

		/**
		 * Dragging initiator.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function dragInit(event) {
			var isTouch = event.type === 'touchstart';
			var source = event.data.source;
			var isSlidee = source === 'slidee';

			// Ignore when already in progress, or interactive element in non-touch navivagion
			if (dragging.init || !isTouch && isInteractive(event.target)) {
				return;
			}

			// Handle dragging conditions
			if (source === 'handle' && (!o.dragHandle || hPos.start === hPos.end)) {
				return;
			}

			// SLIDEE dragging conditions
			if (isSlidee && !(isTouch ? o.touchDragging : o.mouseDragging && event.which < 2)) {
				return;
			}

			if (!isTouch) {
				// prevents native image dragging in Firefox
				stopDefault(event);
			}

			// Reset dragging object
			continuousInit(source);

			// Properties used in dragHandler
			dragging.init = 0;
			dragging.$source = $(event.target);
			dragging.touch = isTouch;
			dragging.pointer = isTouch ? event.originalEvent.touches[0] : event;
			dragging.initX = dragging.pointer.pageX;
			dragging.initY = dragging.pointer.pageY;
			dragging.initPos = isSlidee ? pos.cur : hPos.cur;
			dragging.start = +new Date();
			dragging.time = 0;
			dragging.path = 0;
			dragging.delta = 0;
			dragging.locked = 0;
			dragging.history = [0, 0, 0, 0];
			dragging.pathToLock = isSlidee ? isTouch ? 30 : 10 : 0;

			// Bind dragging events
			$doc.on(isTouch ? dragTouchEvents : dragMouseEvents, dragHandler);

			// Pause ongoing cycle
			self.pause(1);

			// Add dragging class
			(isSlidee ? $slidee : $handle).addClass(o.draggedClass);

			// Trigger moveStart event
			trigger('moveStart');

			// Keep track of a dragging path history. This is later used in the
			// dragging release swing calculation when dragging SLIDEE.
			if (isSlidee) {
				historyID = setInterval(draggingHistoryTick, 10);
			}
		}

		/**
		 * Handler for dragging scrollbar handle or SLIDEE.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function dragHandler(event) {
			dragging.released = event.type === 'mouseup' || event.type === 'touchend';
			dragging.pointer = dragging.touch ? event.originalEvent[dragging.released ? 'changedTouches' : 'touches'][0] : event;
			dragging.pathX = dragging.pointer.pageX - dragging.initX;
			dragging.pathY = dragging.pointer.pageY - dragging.initY;
			dragging.path = sqrt(pow(dragging.pathX, 2) + pow(dragging.pathY, 2));
			dragging.delta = o.horizontal ? dragging.pathX : dragging.pathY;

			if (!dragging.released && dragging.path < 1) return;

			// We haven't decided whether this is a drag or not...
			if (!dragging.init) {
				// If the drag path was very short, maybe it's not a drag?
				if (dragging.path < o.dragThreshold) {
					// If the pointer was released, the path will not become longer and it's
					// definitely not a drag. If not released yet, decide on next iteration
					return dragging.released ? dragEnd() : undefined;
				}
				else {
					// If dragging path is sufficiently long we can confidently start a drag
					// if drag is in different direction than scroll, ignore it
					if (o.horizontal ? abs(dragging.pathX) > abs(dragging.pathY) : abs(dragging.pathX) < abs(dragging.pathY)) {
						dragging.init = 1;
					} else {
						return dragEnd();
					}
				}
			}

			stopDefault(event);

			// Disable click on a source element, as it is unwelcome when dragging
			if (!dragging.locked && dragging.path > dragging.pathToLock && dragging.slidee) {
				dragging.locked = 1;
				dragging.$source.on(clickEvent, disableOneEvent);
			}

			// Cancel dragging on release
			if (dragging.released) {
				dragEnd();

				// Adjust path with a swing on mouse release
				if (o.releaseSwing && dragging.slidee) {
					dragging.swing = (dragging.delta - dragging.history[0]) / 40 * 300;
					dragging.delta += dragging.swing;
					dragging.tweese = abs(dragging.swing) > 10;
				}
			}

			slideTo(dragging.slidee ? round(dragging.initPos - dragging.delta) : handleToSlidee(dragging.initPos + dragging.delta));
		}

		/**
		 * Stops dragging and cleans up after it.
		 *
		 * @return {Void}
		 */
		function dragEnd() {
			clearInterval(historyID);
			dragging.released = true;
			$doc.off(dragging.touch ? dragTouchEvents : dragMouseEvents, dragHandler);
			(dragging.slidee ? $slidee : $handle).removeClass(o.draggedClass);

			// Make sure that disableOneEvent is not active in next tick.
			setTimeout(function () {
				dragging.$source.off(clickEvent, disableOneEvent);
			});

			// Normally, this is triggered in render(), but if there
			// is nothing to render, we have to do it manually here.
			if (pos.cur === pos.dest && dragging.init) {
				trigger('moveEnd');
			}

			// Resume ongoing cycle
			self.resume(1);

			dragging.init = 0;
		}

		/**
		 * Check whether element is interactive.
		 *
		 * @return {Boolean}
		 */
		function isInteractive(element) {
			return ~$.inArray(element.nodeName, interactiveElements) || $(element).is(o.interactive);
		}

		/**
		 * Continuous movement cleanup on mouseup.
		 *
		 * @return {Void}
		 */
		function movementReleaseHandler() {
			self.stop();
			$doc.off('mouseup', movementReleaseHandler);
		}

		/**
		 * Buttons navigation handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function buttonsHandler(event) {
			/*jshint validthis:true */
			stopDefault(event);
			switch (this) {
				case $forwardButton[0]:
				case $backwardButton[0]:
					self.moveBy($forwardButton.is(this) ? o.moveBy : -o.moveBy);
					$doc.on('mouseup', movementReleaseHandler);
					break;

				case $prevButton[0]:
					self.prev();
					break;

				case $nextButton[0]:
					self.next();
					break;

				case $prevPageButton[0]:
					self.prevPage();
					break;

				case $nextPageButton[0]:
					self.nextPage();
					break;
			}
		}

		/**
		 * Mouse wheel delta normalization.
		 *
		 * @param  {Event} event
		 *
		 * @return {Int}
		 */
		function normalizeWheelDelta(event) {
			// wheelDelta needed only for IE8-
			scrolling.curDelta = ((o.horizontal ? event.deltaY || event.deltaX : event.deltaY) || -event.wheelDelta);
			scrolling.curDelta /= event.deltaMode === 1 ? 3 : 100;
			if (!itemNav) {
				return scrolling.curDelta;
			}
			time = +new Date();
			if (scrolling.last < time - scrolling.resetTime) {
				scrolling.delta = 0;
			}
			scrolling.last = time;
			scrolling.delta += scrolling.curDelta;
			if (abs(scrolling.delta) < 1) {
				scrolling.finalDelta = 0;
			} else {
				scrolling.finalDelta = round(scrolling.delta / 1);
				scrolling.delta %= 1;
			}
			return scrolling.finalDelta;
		}

		/**
		 * Mouse scrolling handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function scrollHandler(event) {
			// Mark event as originating in a Sly instance
			event.originalEvent[namespace] = self;
			// Don't hijack global scrolling
			var time = +new Date();
			if (lastGlobalWheel + o.scrollHijack > time && $scrollSource[0] !== document && $scrollSource[0] !== window) {
				lastGlobalWheel = time;
				return;
			}
			// Ignore if there is no scrolling to be done
			if (!o.scrollBy || pos.start === pos.end) {
				return;
			}
			var delta = normalizeWheelDelta(event.originalEvent);
			// Trap scrolling only when necessary and/or requested
			if (o.scrollTrap || delta > 0 && pos.dest < pos.end || delta < 0 && pos.dest > pos.start) {
				stopDefault(event, 1);
			}
			self.slideBy(o.scrollBy * delta);
		}

		/**
		 * Scrollbar click handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function scrollbarHandler(event) {
			// Only clicks on scroll bar. Ignore the handle.
			if (o.clickBar && event.target === $sb[0]) {
				stopDefault(event);
				// Calculate new handle position and sync SLIDEE to it
				slideTo(handleToSlidee((o.horizontal ? event.pageX - $sb.offset().left : event.pageY - $sb.offset().top) - handleSize / 2));
			}
		}

		/**
		 * Keyboard input handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function keyboardHandler(event) {
			if (!o.keyboardNavBy) {
				return;
			}

			switch (event.which) {
				// Left or Up
				case o.horizontal ? 37 : 38:
					stopDefault(event);
					self[o.keyboardNavBy === 'pages' ? 'prevPage' : 'prev']();
					break;

				// Right or Down
				case o.horizontal ? 39 : 40:
					stopDefault(event);
					self[o.keyboardNavBy === 'pages' ? 'nextPage' : 'next']();
					break;
			}
		}

		/**
		 * Click on item activation handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function activateHandler(event) {
			/*jshint validthis:true */

			// Ignore clicks on interactive elements.
			if (isInteractive(this)) {
				event.originalEvent[namespace + 'ignore'] = true;
				return;
			}

			// Ignore events that:
			// - are not originating from direct SLIDEE children
			// - originated from interactive elements
			if (this.parentNode !== $slidee[0] || event.originalEvent[namespace + 'ignore']) return;

			self.activate(this);
		}

		/**
		 * Click on page button handler.
		 *
		 * @param {Event} event
		 *
		 * @return {Void}
		 */
		function activatePageHandler() {
			/*jshint validthis:true */
			// Accept only events from direct pages bar children.
			if (this.parentNode === $pb[0]) {
				self.activatePage($pages.index(this));
			}
		}

		/**
		 * Pause on hover handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function pauseOnHoverHandler(event) {
			if (o.pauseOnHover) {
				self[event.type === 'mouseenter' ? 'pause' : 'resume'](2);
			}
		}

		/**
		 * Trigger callbacks for event.
		 *
		 * @param  {String} name Event name.
		 * @param  {Mixed}  argX Arguments passed to callbacks.
		 *
		 * @return {Void}
		 */
		function trigger(name, arg1) {
			if (callbacks[name]) {
				l = callbacks[name].length;
				// Callbacks will be stored and executed from a temporary array to not
				// break the execution queue when one of the callbacks unbinds itself.
				tmpArray.length = 0;
				for (i = 0; i < l; i++) {
					tmpArray.push(callbacks[name][i]);
				}
				// Execute the callbacks
				for (i = 0; i < l; i++) {
					tmpArray[i].call(self, name, arg1);
				}
			}
		}

		/**
		 * Destroys instance and everything it created.
		 *
		 * @return {Void}
		 */
		self.destroy = function () {
			// Remove the reference to itself
			Sly.removeInstance(frame);

			// Unbind all events
			$scrollSource
				.add($handle)
				.add($sb)
				.add($pb)
				.add($forwardButton)
				.add($backwardButton)
				.add($prevButton)
				.add($nextButton)
				.add($prevPageButton)
				.add($nextPageButton)
				.off('.' + namespace);

			// Unbinding specifically as to not nuke out other instances
			$doc.off('keydown', keyboardHandler);

			// Remove classes
			$prevButton
				.add($nextButton)
				.add($prevPageButton)
				.add($nextPageButton)
				.removeClass(o.disabledClass);

			if ($items && rel.activeItem != null) {
				$items.eq(rel.activeItem).removeClass(o.activeClass);
			}

			// Remove page items
			$pb.empty();

			if (!parallax) {
				// Unbind events from frame
				$frame.off('.' + namespace);
				// Restore original styles
				frameStyles.restore();
				slideeStyles.restore();
				sbStyles.restore();
				handleStyles.restore();
				// Remove the instance from element data storage
				$.removeData(frame, namespace);
			}

			// Clean up collections
			items.length = pages.length = 0;
			last = {};

			// Reset initialized status and return the instance
			self.initialized = 0;
			return self;
		};

		/**
		 * Initialize.
		 *
		 * @return {Object}
		 */
		self.init = function () {
			if (self.initialized) {
				return;
			}

			// Disallow multiple instances on the same element
			if (Sly.getInstance(frame)) throw new Error('There is already a Sly instance on this element');

			// Store the reference to itself
			Sly.storeInstance(frame, self);

			// Register callbacks map
			self.on(callbackMap);

			// Save styles
			var holderProps = ['overflow', 'position'];
			var movableProps = ['position', 'webkitTransform', 'msTransform', 'transform', 'left', 'top', 'width', 'height'];
			frameStyles.save.apply(frameStyles, holderProps);
			sbStyles.save.apply(sbStyles, holderProps);
			slideeStyles.save.apply(slideeStyles, movableProps);
			handleStyles.save.apply(handleStyles, movableProps);

			// Set required styles
			var $movables = $handle;
			if (!parallax) {
				$movables = $movables.add($slidee);
				$frame.css('overflow', 'hidden');
				if (!transform && $frame.css('position') === 'static') {
					$frame.css('position', 'relative');
				}
			}
			if (transform) {
				if (gpuAcceleration) {
					$movables.css(transform, gpuAcceleration);
				}
			} else {
				if ($sb.css('position') === 'static') {
					$sb.css('position', 'relative');
				}
				$movables.css({ position: 'absolute' });
			}

			// Navigation buttons
			if (o.forward) {
				$forwardButton.on(mouseDownEvent, buttonsHandler);
			}
			if (o.backward) {
				$backwardButton.on(mouseDownEvent, buttonsHandler);
			}
			if (o.prev) {
				$prevButton.on(clickEvent, buttonsHandler);
			}
			if (o.next) {
				$nextButton.on(clickEvent, buttonsHandler);
			}
			if (o.prevPage) {
				$prevPageButton.on(clickEvent, buttonsHandler);
			}
			if (o.nextPage) {
				$nextPageButton.on(clickEvent, buttonsHandler);
			}

			// Scrolling navigation
			$scrollSource.on(wheelEvent, scrollHandler);

			// Clicking on scrollbar navigation
			if ($sb[0]) {
				$sb.on(clickEvent, scrollbarHandler);
			}

			// Click on items navigation
			if (itemNav && o.activateOn) {
				$frame.on(o.activateOn + '.' + namespace, '*', activateHandler);
			}

			// Pages navigation
			if ($pb[0] && o.activatePageOn) {
				$pb.on(o.activatePageOn + '.' + namespace, '*', activatePageHandler);
			}

			// Dragging navigation
			$dragSource.on(dragInitEvents, { source: 'slidee' }, dragInit);

			// Scrollbar dragging navigation
			if ($handle) {
				$handle.on(dragInitEvents, { source: 'handle' }, dragInit);
			}

			// Keyboard navigation
			$doc.on('keydown', keyboardHandler);

			if (!parallax) {
				// Pause on hover
				$frame.on('mouseenter.' + namespace + ' mouseleave.' + namespace, pauseOnHoverHandler);
				// Reset native FRAME element scroll
				$frame.on('scroll.' + namespace, resetScroll);
			}

			// Mark instance as initialized
			self.initialized = 1;

			// Load
			load(true);

			// Initiate automatic cycling
			if (o.cycleBy && !parallax) {
				self[o.startPaused ? 'pause' : 'resume']();
			}

			// Return instance
			return self;
		};
	}

	Sly.getInstance = function (element) {
		return $.data(element, namespace);
	};

	Sly.storeInstance = function (element, sly) {
		return $.data(element, namespace, sly);
	};

	Sly.removeInstance = function (element) {
		return $.removeData(element, namespace);
	};

	/**
	 * Return type of the value.
	 *
	 * @param  {Mixed} value
	 *
	 * @return {String}
	 */
	function type(value) {
		if (value == null) {
			return String(value);
		}

		if (typeof value === 'object' || typeof value === 'function') {
			return Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase() || 'object';
		}

		return typeof value;
	}

	/**
	 * Event preventDefault & stopPropagation helper.
	 *
	 * @param {Event} event     Event object.
	 * @param {Bool}  noBubbles Cancel event bubbling.
	 *
	 * @return {Void}
	 */
	function stopDefault(event, noBubbles) {
		event.preventDefault();
		if (noBubbles) {
			event.stopPropagation();
		}
	}

	/**
	 * Disables an event it was triggered on and unbinds itself.
	 *
	 * @param  {Event} event
	 *
	 * @return {Void}
	 */
	function disableOneEvent(event) {
		/*jshint validthis:true */
		stopDefault(event, 1);
		$(this).off(event.type, disableOneEvent);
	}

	/**
	 * Resets native element scroll values to 0.
	 *
	 * @return {Void}
	 */
	function resetScroll() {
		/*jshint validthis:true */
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}

	/**
	 * Check if variable is a number.
	 *
	 * @param {Mixed} value
	 *
	 * @return {Boolean}
	 */
	function isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}

	/**
	 * Parse style to pixels.
	 *
	 * @param {Object}   $item    jQuery object with element.
	 * @param {Property} property CSS property to get the pixels from.
	 *
	 * @return {Int}
	 */
	function getPx($item, property) {
		return 0 | round(String($item.css(property)).replace(/[^\-0-9.]/g, ''));
	}

	/**
	 * Make sure that number is within the limits.
	 *
	 * @param {Number} number
	 * @param {Number} min
	 * @param {Number} max
	 *
	 * @return {Number}
	 */
	function within(number, min, max) {
		return number < min ? min : number > max ? max : number;
	}

	/**
	 * Saves element styles for later restoration.
	 *
	 * Example:
	 *   var styles = new StyleRestorer(frame);
	 *   styles.save('position');
	 *   element.style.position = 'absolute';
	 *   styles.restore(); // restores to state before the assignment above
	 *
	 * @param {Element} element
	 */
	function StyleRestorer(element) {
		var self = {};
		self.style = {};
		self.save = function () {
			if (!element || !element.nodeType) return;
			for (var i = 0; i < arguments.length; i++) {
				self.style[arguments[i]] = element.style[arguments[i]];
			}
			return self;
		};
		self.restore = function () {
			if (!element || !element.nodeType) return;
			for (var prop in self.style) {
				if (self.style.hasOwnProperty(prop)) element.style[prop] = self.style[prop];
			}
			return self;
		};
		return self;
	}

	// Local WindowAnimationTiming interface polyfill
	(function (w) {
		rAF = w.requestAnimationFrame
			|| w.webkitRequestAnimationFrame
			|| fallback;

		/**
		* Fallback implementation.
		*/
		var prev = new Date().getTime();
		function fallback(fn) {
			var curr = new Date().getTime();
			var ms = Math.max(0, 16 - (curr - prev));
			var req = setTimeout(fn, ms);
			prev = curr;
			return req;
		}

		/**
		* Cancel.
		*/
		var cancel = w.cancelAnimationFrame
			|| w.webkitCancelAnimationFrame
			|| w.clearTimeout;

		cAF = function(id){
			cancel.call(w, id);
		};
	}(window));

	// Feature detects
	(function () {
		var prefixes = ['', 'Webkit', 'Moz', 'ms', 'O'];
		var el = document.createElement('div');

		function testProp(prop) {
			for (var p = 0, pl = prefixes.length; p < pl; p++) {
				var prefixedProp = prefixes[p] ? prefixes[p] + prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
				if (el.style[prefixedProp] != null) {
					return prefixedProp;
				}
			}
		}

		// Global support indicators
		transform = testProp('transform');
		gpuAcceleration = testProp('perspective') ? 'translateZ(0) ' : '';
	}());

	// Expose class globally
	w[className] = Sly;

	// jQuery proxy
	$.fn[pluginName] = function (options, callbackMap) {
		var method, methodArgs;

		// Attributes logic
		if (!$.isPlainObject(options)) {
			if (type(options) === 'string' || options === false) {
				method = options === false ? 'destroy' : options;
				methodArgs = Array.prototype.slice.call(arguments, 1);
			}
			options = {};
		}

		// Apply to all elements
		return this.each(function (i, element) {
			// Call with prevention against multiple instantiations
			var plugin = Sly.getInstance(element);

			if (!plugin && !method) {
				// Create a new object if it doesn't exist yet
				plugin = new Sly(element, options, callbackMap).init();
			} else if (plugin && method) {
				// Call method
				if (plugin[method]) {
					plugin[method].apply(plugin, methodArgs);
				}
			}
		});
	};

	// Default options
	Sly.defaults = {
		slidee:     null,  // Selector, DOM element, or jQuery object with DOM element representing SLIDEE.
		horizontal: false, // Switch to horizontal mode.

		// Item based navigation
		itemNav:        null,  // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'.
		itemSelector:   null,  // Select only items that match this selector.
		smart:          false, // Repositions the activated item to help with further navigation.
		activateOn:     null,  // Activate an item on this event. Can be: 'click', 'mouseenter', ...
		activateMiddle: false, // Always activate the item in the middle of the FRAME. forceCentered only.

		// Scrolling
		scrollSource: null,  // Element for catching the mouse wheel scrolling. Default is FRAME.
		scrollBy:     0,     // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
		scrollHijack: 300,   // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
		scrollTrap:   false, // Don't bubble scrolling when hitting scrolling limits.

		// Dragging
		dragSource:    null,  // Selector or DOM element for catching dragging events. Default is FRAME.
		mouseDragging: false, // Enable navigation by dragging the SLIDEE with mouse cursor.
		touchDragging: false, // Enable navigation by dragging the SLIDEE with touch events.
		releaseSwing:  false, // Ease out on dragging swing release.
		swingSpeed:    0.2,   // Swing synchronization speed, where: 1 = instant, 0 = infinite.
		elasticBounds: false, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
		dragThreshold: 3,     // Distance in pixels before Sly recognizes dragging.
		interactive:   null,  // Selector for special interactive elements.

		// Scrollbar
		scrollBar:     null,  // Selector or DOM element for scrollbar container.
		dragHandle:    false, // Whether the scrollbar handle should be draggable.
		dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
		minHandleSize: 50,    // Minimal height or width (depends on sly direction) of a handle in pixels.
		clickBar:      false, // Enable navigation by clicking on scrollbar.
		syncSpeed:     0.5,   // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.

		// Pagesbar
		pagesBar:       null, // Selector or DOM element for pages bar container.
		activatePageOn: null, // Event used to activate page. Can be: click, mouseenter, ...
		pageBuilder:          // Page item generator.
			function (index) {
				return '<li>' + (index + 1) + '</li>';
			},

		// Navigation buttons
		forward:  null, // Selector or DOM element for "forward movement" button.
		backward: null, // Selector or DOM element for "backward movement" button.
		prev:     null, // Selector or DOM element for "previous item" button.
		next:     null, // Selector or DOM element for "next item" button.
		prevPage: null, // Selector or DOM element for "previous page" button.
		nextPage: null, // Selector or DOM element for "next page" button.

		// Automated cycling
		cycleBy:       null,  // Enable automatic cycling by 'items' or 'pages'.
		cycleInterval: 5000,  // Delay between cycles in milliseconds.
		pauseOnHover:  false, // Pause cycling when mouse hovers over the FRAME.
		startPaused:   false, // Whether to start in paused sate.

		// Mixed options
		moveBy:        300,     // Speed in pixels per second used by forward and backward buttons.
		speed:         0,       // Animations speed in milliseconds. 0 to disable animations.
		easing:        'swing', // Easing for duration based (tweening) animations.
		startAt:       null,    // Starting offset in pixels or items.
		keyboardNavBy: null,    // Enable keyboard navigation by 'items' or 'pages'.

		// Classes
		draggedClass:  'dragged', // Class for dragged elements (like SLIDEE or scrollbar handle).
		activeClass:   'active',  // Class for active items and pages.
		disabledClass: 'disabled' // Class for disabled navigation elements.
	};
}(jQuery, window));
// Generated by CoffeeScript 1.10.0

/**
@license Sticky-kit v1.1.3 | MIT | Leaf Corcoran 2015 | http://leafo.net
 */

(function() {
  var $, win;
  
  $ = window.jQuery;

  win = $(window);

  $.fn.stick_in_parent = function(opts) {
    var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, outer_width, parent_selector, recalc_every, sticky_class;
    if (opts == null) {
      opts = {};
    }
    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
    if (offset_top == null) {
      offset_top = 0;
    }
    if (parent_selector == null) {
      parent_selector = void 0;
    }
    if (inner_scrolling == null) {
      inner_scrolling = true;
    }
    if (sticky_class == null) {
      sticky_class = "is_stuck";
    }
    doc = $(document);
    if (enable_bottoming == null) {
      enable_bottoming = true;
    }
    outer_width = function(el) {
      var _el, computed, w;
      if (window.getComputedStyle) {
        _el = el[0];
        computed = window.getComputedStyle(el[0]);
        w = parseFloat(computed.getPropertyValue("width")) + parseFloat(computed.getPropertyValue("margin-left")) + parseFloat(computed.getPropertyValue("margin-right"));
        if (computed.getPropertyValue("box-sizing") !== "border-box") {
          w += parseFloat(computed.getPropertyValue("border-left-width")) + parseFloat(computed.getPropertyValue("border-right-width")) + parseFloat(computed.getPropertyValue("padding-left")) + parseFloat(computed.getPropertyValue("padding-right"));
        }
        return w;
      } else {
        return el.outerWidth(true);
      }
    };
    fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
      var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
      if (elm.data("sticky_kit")) {
        return;
      }
      elm.data("sticky_kit", true);
      last_scroll_height = doc.height();
      parent = elm.parent();
      if (parent_selector != null) {
        parent = parent.closest(parent_selector);
      }
      if (!parent.length) {
        throw "failed to find stick parent";
      }
      fixed = false;
      bottomed = false;
      spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
      if (spacer) {
        spacer.css('position', elm.css('position'));
      }
      recalc = function() {
        var border_top, padding_top, restore;
        if (detached) {
          return;
        }
        last_scroll_height = doc.height();
        border_top = parseInt(parent.css("border-top-width"), 10);
        padding_top = parseInt(parent.css("padding-top"), 10);
        padding_bottom = parseInt(parent.css("padding-bottom"), 10);
        parent_top = parent.offset().top + border_top + padding_top;
        parent_height = parent.height();
        if (fixed) {
          fixed = false;
          bottomed = false;
          if (manual_spacer == null) {
            elm.insertAfter(spacer);
            spacer.detach();
          }
          elm.css({
            position: "",
            top: "",
            width: "",
            bottom: ""
          }).removeClass(sticky_class);
          restore = true;
        }
        top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
        height = elm.outerHeight(true);
        el_float = elm.css("float");
        if (spacer) {
          spacer.css({
            width: outer_width(elm),
            height: height,
            display: elm.css("display"),
            "vertical-align": elm.css("vertical-align"),
            "float": el_float
          });
        }
        if (restore) {
          return tick();
        }
      };
      recalc();
      if (height === parent_height) {
        return;
      }
      last_pos = void 0;
      offset = offset_top;
      recalc_counter = recalc_every;
      tick = function() {
        var css, delta, recalced, scroll, will_bottom, win_height;
        if (detached) {
          return;
        }
        recalced = false;
        if (recalc_counter != null) {
          recalc_counter -= 1;
          if (recalc_counter <= 0) {
            recalc_counter = recalc_every;
            recalc();
            recalced = true;
          }
        }
        if (!recalced && doc.height() !== last_scroll_height) {
          recalc();
          recalced = true;
        }
        scroll = win.scrollTop();
        if (last_pos != null) {
          delta = scroll - last_pos;
        }
        last_pos = scroll;
        if (fixed) {
          if (enable_bottoming) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
            if (bottomed && !will_bottom) {
              bottomed = false;
              elm.css({
                position: "fixed",
                bottom: "",
                top: offset
              }).trigger("sticky_kit:unbottom");
            }
          }
          if (scroll < top) {
            fixed = false;
            offset = offset_top;
            if (manual_spacer == null) {
              if (el_float === "left" || el_float === "right") {
                elm.insertAfter(spacer);
              }
              spacer.detach();
            }
            css = {
              position: "",
              width: "",
              top: ""
            };
            elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
          }
          if (inner_scrolling) {
            win_height = win.height();
            if (height + offset_top > win_height) {
              if (!bottomed) {
                offset -= delta;
                offset = Math.max(win_height - height, offset);
                offset = Math.min(offset_top, offset);
                if (fixed) {
                  elm.css({
                    top: offset + "px"
                  });
                }
              }
            }
          }
        } else {
          if (scroll > top) {
            fixed = true;
            css = {
              position: "fixed",
              top: offset
            };
            css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
            elm.css(css).addClass(sticky_class);
            if (manual_spacer == null) {
              elm.after(spacer);
              if (el_float === "left" || el_float === "right") {
                spacer.append(elm);
              }
            }
            elm.trigger("sticky_kit:stick");
          }
        }
        if (fixed && enable_bottoming) {
          if (will_bottom == null) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
          }
          if (!bottomed && will_bottom) {
            bottomed = true;
            if (parent.css("position") === "static") {
              parent.css({
                position: "relative"
              });
            }
            return elm.css({
              position: "absolute",
              bottom: padding_bottom,
              top: "auto"
            }).trigger("sticky_kit:bottom");
          }
        }
      };
      recalc_and_tick = function() {
        recalc();
        return tick();
      };
      detach = function() {
        detached = true;
        win.off("touchmove", tick);
        win.off("scroll", tick);
        win.off("resize", recalc_and_tick);
        $(document.body).off("sticky_kit:recalc", recalc_and_tick);
        elm.off("sticky_kit:detach", detach);
        elm.removeData("sticky_kit");
        elm.css({
          position: "",
          bottom: "",
          top: "",
          width: ""
        });
        parent.position("position", "");
        if (fixed) {
          if (manual_spacer == null) {
            if (el_float === "left" || el_float === "right") {
              elm.insertAfter(spacer);
            }
            spacer.remove();
          }
          return elm.removeClass(sticky_class);
        }
      };
      win.on("touchmove", tick);
      win.on("scroll", tick);
      win.on("resize", recalc_and_tick);
      $(document.body).on("sticky_kit:recalc", recalc_and_tick);
      elm.on("sticky_kit:detach", detach);
      return setTimeout(tick, 0);
    };
    for (i = 0, len = this.length; i < len; i++) {
      elm = this[i];
      fn($(elm));
    }
    return this;
  };

}).call(this);