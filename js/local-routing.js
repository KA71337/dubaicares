"use strict";

(function () {
  var HTML_ROUTES = {
    "index.html": { clean: "/", file: "index.html" },
    "our-work.html": { clean: "/our-work", file: "our-work.html" },
    "volunteer.html": { clean: "/volunteer", file: "volunteer.html" },
    "support-us.html": { clean: "/support-us", file: "support-us.html" },
    "supports-us_donate.html": {
      clean: "/donate",
      file: "supports-us_donate.html",
    },
    "supports-us_volunteering-opportunities.html": {
      clean: "/volunteering-opportunities",
      file: "supports-us_volunteering-opportunities.html",
    },
    "initiatives.html": { clean: "/initiatives", file: "initiatives.html" },
    "maintenance.html": { clean: "/maintenance", file: "maintenance.html" },
  };

  var CLEAN_ROUTES = {};
  Object.keys(HTML_ROUTES).forEach(function (file) {
    CLEAN_ROUTES[HTML_ROUTES[file].clean] = HTML_ROUTES[file];
  });

  var SITE_HOSTS = {
    "dubaicares.ae": true,
    "www.dubaicares.ae": true,
  };

  var EXTERNAL_PAGE_EXTENSIONS =
    /\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|7z|jpe?g|png|gif|webp|svg|mp4|mp3|mov|avi|webm|woff2?|ttf|eot)$/i;
  var LOCAL_ASSET_PATHS = /^(?:css|js|img|images|fonts|files|concrete|application)\//i;
  var transitionTimer = null;

  function trimSlashes(path) {
    return path.replace(/^\/+|\/+$/g, "");
  }

  function normalizePath(pathname) {
    var path = pathname || "/";
    try {
      path = decodeURIComponent(path);
    } catch (error) {
      // Keep the encoded path if a copied source URL is malformed.
    }
    path = path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
    if (path.length > 1) {
      path = path.replace(/\/+$/g, "");
    }
    return path || "/";
  }

  function isLocalOrigin(url) {
    return (
      url.protocol === "file:" ||
      url.origin === window.location.origin ||
      SITE_HOSTS[url.hostname.toLowerCase()]
    );
  }

  function routeForPath(pathname) {
    var normalized = normalizePath(pathname);
    var cleanPath = normalized.toLowerCase();
    var slug = trimSlashes(cleanPath);
    var fileName = slug.split("/").pop();
    var maintenanceRoute = HTML_ROUTES["maintenance.html"];

    if (!slug || slug === "index" || slug === "index.html") {
      return HTML_ROUTES["index.html"];
    }

    if (HTML_ROUTES[fileName]) {
      return HTML_ROUTES[fileName];
    }

    if (CLEAN_ROUTES["/" + slug]) {
      return CLEAN_ROUTES["/" + slug];
    }

    if (LOCAL_ASSET_PATHS.test(slug) || EXTERNAL_PAGE_EXTENSIONS.test(slug)) {
      return null;
    }

    if (
      slug === "volunteer/volunteering-opportunities" ||
      slug === "initiatives/volunteering-opportunities" ||
      slug === "volunteering-opportunities"
    ) {
      return HTML_ROUTES["supports-us_volunteering-opportunities.html"];
    }

    if (
      slug === "support-us/donate" ||
      slug === "supports-us/donate" ||
      slug === "donate"
    ) {
      return HTML_ROUTES["supports-us_donate.html"];
    }

    return maintenanceRoute;
  }

  function currentFileBase() {
    return window.location.href.split(/[?#]/)[0].replace(/\/[^/]*$/, "/");
  }

  function cleanHrefFor(route, search, hash) {
    search = search || "";
    hash = hash || "";

    if (window.location.protocol === "file:") {
      if (route.clean === "/") {
        return currentFileBase() + search + hash;
      }

      return currentFileBase() + route.clean.slice(1) + search + hash;
    }

    return route.clean + search + hash;
  }

  function navigationHrefFor(route, search, hash) {
    search = search || "";
    hash = hash || "";

    if (window.location.protocol === "file:") {
      return route.file + search + hash;
    }

    return cleanHrefFor(route, search, hash);
  }

  function normalizeHref(rawHref) {
    var parsed;

    if (!rawHref || rawHref === "#") {
      return null;
    }

    if (/^(?:javascript|mailto|tel|sms|data|blob):/i.test(rawHref)) {
      return null;
    }

    try {
      parsed = new URL(rawHref, window.location.href);
    } catch (error) {
      return null;
    }

    if (!isLocalOrigin(parsed)) {
      return null;
    }

    var route = routeForPath(parsed.pathname);

    if (!route) {
      return null;
    }

    return {
      route: route,
      cleanHref: cleanHrefFor(route, parsed.search, parsed.hash),
      navigationHref: navigationHrefFor(route, parsed.search, parsed.hash),
      hash: parsed.hash,
    };
  }

  function currentRoute() {
    var path = window.location.pathname;
    var route = routeForPath(path, false);

    if (route) {
      return route;
    }

    var filename = trimSlashes(path).split("/").pop();
    return HTML_ROUTES[filename] || null;
  }

  function cleanCurrentAddress() {
    var route = currentRoute();

    if (!route || !window.history || !window.history.replaceState) {
      return;
    }

    var cleanUrl = cleanHrefFor(route, window.location.search, window.location.hash);

    if (cleanUrl !== window.location.href && cleanUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, document.title, cleanUrl);
    }
  }

  function rewriteLink(link) {
    var normalized = normalizeHref(link.getAttribute("href"));

    if (!normalized) {
      return;
    }

    link.setAttribute("data-local-route", normalized.route.clean);
    link.setAttribute("data-local-route-file", normalized.route.file);
    link.setAttribute("href", navigationHrefFor(normalized.route, new URL(normalized.cleanHref, window.location.href).search, normalized.hash));

    if (link.target && link.target.toLowerCase() === "_blank") {
      link.setAttribute("target", "_self");
    }
  }

  function rewriteForm(form) {
    var action = form.getAttribute("action");
    var parsed;

    if (!action) {
      return;
    }

    try {
      parsed = new URL(action, window.location.href);
    } catch (error) {
      return;
    }

    if (!SITE_HOSTS[parsed.hostname.toLowerCase()]) {
      return;
    }

    if (normalizePath(parsed.pathname).toLowerCase().indexOf("/search") === 0) {
      form.setAttribute("action", navigationHrefFor(HTML_ROUTES["maintenance.html"], "", ""));
    }
  }

  function rewriteDocumentLinks(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var links = scope.querySelectorAll("a[href]");
    var forms = scope.querySelectorAll("form[action]");

    Array.prototype.forEach.call(links, rewriteLink);
    Array.prototype.forEach.call(forms, rewriteForm);
  }

  function sameDocumentTarget(href) {
    var target = new URL(href, window.location.href);
    var current = new URL(window.location.href);

    target.hash = "";
    current.hash = "";

    return target.href === current.href;
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function finishPageEnter() {
    var root = document.documentElement;

    window.clearTimeout(transitionTimer);
    root.classList.remove("local-transition-leaving");
    root.classList.remove("local-transition-pending");
    root.classList.add("local-transition-ready");
  }

  function goToLocalPage(href) {
    var delay = prefersReducedMotion() ? 0 : 220;

    window.clearTimeout(transitionTimer);
    document.documentElement.classList.add("local-transition-leaving");
    transitionTimer = window.setTimeout(function () {
      window.location.assign(href);
    }, delay);
  }

  function onClick(event) {
    var link = event.target.closest && event.target.closest("a[href]");
    var normalized;

    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.hasAttribute("download")
    ) {
      return;
    }

    normalized = normalizeHref(link.getAttribute("href"));

    if (!normalized) {
      return;
    }

    if (normalized.hash && sameDocumentTarget(normalized.navigationHref)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    goToLocalPage(normalized.navigationHref);
  }

  function observeNewLinks() {
    if (!window.MutationObserver) {
      return;
    }

    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType !== 1) {
            return;
          }

          if (node.matches && node.matches("a[href]")) {
            rewriteLink(node);
          }

          if (node.querySelectorAll) {
            rewriteDocumentLinks(node);
          }
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() {
    cleanCurrentAddress();
    rewriteDocumentLinks(document);
    observeNewLinks();
    window.requestAnimationFrame(finishPageEnter);
  }

  document.addEventListener("click", onClick, true);
  window.addEventListener("pageshow", finishPageEnter);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
