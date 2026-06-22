"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const routes = [
  { file: "index.html", clean: "" },
  { file: "our-work.html", clean: "our-work" },
  { file: "volunteer.html", clean: "volunteer" },
  { file: "support-us.html", clean: "support-us" },
  { file: "supports-us_donate.html", clean: "donate" },
  {
    file: "supports-us_volunteering-opportunities.html",
    clean: "volunteering-opportunities",
  },
  { file: "initiatives.html", clean: "initiatives" },
  { file: "maintenance.html", clean: "maintenance" },
];

const fileRouteMap = new Map(routes.map((route) => [route.file, route]));
const cleanRouteMap = new Map(routes.map((route) => [route.clean, route]));
const siteHosts = new Set(["dubaicares.ae", "www.dubaicares.ae"]);
const localAssetPaths = /^(css|js|img|images|fonts|files)\//i;

function normalizePathname(pathname) {
  let normalized = pathname || "/";

  try {
    normalized = decodeURIComponent(normalized);
  } catch (_error) {
    // Keep the original path if a copied URL is malformed.
  }

  return normalized.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "");
}

function routeForPathname(pathname) {
  const normalized = normalizePathname(pathname).toLowerCase();
  const slug = trimSlashes(normalized);
  const fileName = slug.split("/").pop();

  if (!slug || slug === "index" || slug === "index.html") {
    return cleanRouteMap.get("");
  }

  if (fileRouteMap.has(fileName)) {
    return fileRouteMap.get(fileName);
  }

  if (cleanRouteMap.has(slug)) {
    return cleanRouteMap.get(slug);
  }

  if (
    slug === "support-us/donate" ||
    slug === "supports-us/donate" ||
    slug === "donate"
  ) {
    return cleanRouteMap.get("donate");
  }

  if (
    slug === "volunteer/volunteering-opportunities" ||
    slug === "initiatives/volunteering-opportunities" ||
    slug === "volunteering-opportunities"
  ) {
    return cleanRouteMap.get("volunteering-opportunities");
  }

  return null;
}

function routeForUrl(rawUrl) {
  let parsed;

  if (!rawUrl || rawUrl === "#") {
    return null;
  }

  if (/^(?:javascript|mailto|tel|sms|data|blob):/i.test(rawUrl)) {
    return null;
  }

  try {
    parsed = new URL(rawUrl, "https://www.dubaicares.ae/");
  } catch (_error) {
    return null;
  }

  if (parsed.origin !== "https://www.dubaicares.ae" && !siteHosts.has(parsed.hostname)) {
    return null;
  }

  if (localAssetPaths.test(trimSlashes(parsed.pathname))) {
    return null;
  }

  const route = routeForPathname(parsed.pathname);

  if (!route) {
    return null;
  }

  return {
    route,
    search: parsed.search,
    hash: parsed.hash,
  };
}

function hrefForRoute(route, search, hash, context) {
  const prefix = context === "nested" ? "../" : "";
  const base = route.clean ? `${prefix}${route.clean}/` : prefix || "./";

  return `${base}${search || ""}${hash || ""}`;
}

function rewritePageLinks(html, context) {
  return html.replace(
    /\b(href|action)=(["'])(.*?)\2/gi,
    (match, attribute, quote, value) => {
      const route = routeForUrl(value);

      if (!route) {
        return match;
      }

      return `${attribute}=${quote}${hrefForRoute(
        route.route,
        route.search,
        route.hash,
        context,
      )}${quote}`;
    },
  );
}

function prefixNestedAssets(html) {
  return html.replace(
    /(?<=[("'=\s])((?:css|js|img|images|fonts|files)\/)/gi,
    "../$1",
  );
}

function transformHtml(html, context) {
  let transformed = rewritePageLinks(html, context);

  if (context === "nested") {
    transformed = prefixNestedAssets(transformed);
  }

  return transformed;
}

function writeIfChanged(filePath, contents) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === contents) {
    return false;
  }

  fs.writeFileSync(filePath, contents);
  return true;
}

function build() {
  const changed = [];

  for (const route of routes) {
    const sourcePath = path.join(root, route.file);
    const sourceHtml = fs.readFileSync(sourcePath, "utf8");
    const rootHtml = transformHtml(sourceHtml, "root");

    if (writeIfChanged(sourcePath, rootHtml)) {
      changed.push(route.file);
    }

    if (!route.clean) {
      continue;
    }

    const outputDir = path.join(root, route.clean);
    const outputPath = path.join(outputDir, "index.html");
    fs.mkdirSync(outputDir, { recursive: true });

    const nestedHtml = transformHtml(rootHtml, "nested");

    if (writeIfChanged(outputPath, nestedHtml)) {
      changed.push(path.relative(root, outputPath));
    }
  }

  console.log(
    changed.length
      ? `Updated ${changed.length} file(s):\n${changed.join("\n")}`
      : "Static routes are already up to date.",
  );
}

build();
