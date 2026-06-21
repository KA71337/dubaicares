"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const port = Number(process.env.PORT || 8765);

const routes = new Map([
  ["/", "index.html"],
  ["/our-work", "our-work.html"],
  ["/volunteer", "volunteer.html"],
  ["/support-us", "support-us.html"],
  ["/donate", "supports-us_donate.html"],
  ["/volunteering-opportunities", "supports-us_volunteering-opportunities.html"],
  ["/initiatives", "initiatives.html"],
  ["/maintenance", "maintenance.html"],
]);

const htmlRedirects = new Map([
  ["/index.html", "/"],
  ["/our-work.html", "/our-work"],
  ["/volunteer.html", "/volunteer"],
  ["/support-us.html", "/support-us"],
  ["/supports-us_donate.html", "/donate"],
  ["/supports-us_volunteering-opportunities.html", "/volunteering-opportunities"],
  ["/initiatives.html", "/initiatives"],
  ["/maintenance.html", "/maintenance"],
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

function normalizeUrlPath(urlPath) {
  let pathname = decodeURIComponent(urlPath).replace(/\\/g, "/");

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/g, "");
  }

  return pathname || "/";
}

function cleanRouteFor(pathname) {
  const pathName = normalizeUrlPath(pathname).toLowerCase();
  const slug = pathName.replace(/^\/+|\/+$/g, "");

  if (routes.has(pathName)) {
    return pathName;
  }

  if (htmlRedirects.has(pathName)) {
    return htmlRedirects.get(pathName);
  }

  if (!slug || slug === "index") {
    return "/";
  }

  if (
    slug === "volunteer/volunteering-opportunities" ||
    slug === "initiatives/volunteering-opportunities" ||
    slug === "volunteering-opportunities"
  ) {
    return "/volunteering-opportunities";
  }

  if (
    slug === "support-us/donate" ||
    slug === "supports-us/donate" ||
    slug === "donate"
  ) {
    return "/donate";
  }

  if (!path.extname(pathName)) {
    return "/maintenance";
  }

  if (path.extname(pathName).toLowerCase() === ".html") {
    return "/maintenance";
  }

  return null;
}

function sendRedirect(response, location, search) {
  response.writeHead(302, { Location: location + (search || "") });
  response.end();
}

function sendFile(response, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes[ext] || "application/octet-stream";

  fs.createReadStream(filePath)
    .on("open", () => {
      response.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": "no-store",
      });
    })
    .on("error", () => {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    })
    .pipe(response);
}

function resolveStaticPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, "");
  const candidate = path.resolve(root, relative);

  if (!candidate.startsWith(root + path.sep) && candidate !== root) {
    return null;
  }

  return candidate;
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const pathname = normalizeUrlPath(requestUrl.pathname);
  const staticPath = resolveStaticPath(pathname);
  const cleanRoute = cleanRouteFor(pathname);

  if (cleanRoute && cleanRoute !== pathname.toLowerCase()) {
    sendRedirect(response, cleanRoute, requestUrl.search);
    return;
  }

  if (cleanRoute && routes.has(cleanRoute)) {
    sendFile(response, path.join(root, routes.get(cleanRoute)));
    return;
  }

  if (staticPath && fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    sendFile(response, staticPath);
    return;
  }

  if (!path.extname(pathname) || path.extname(pathname).toLowerCase() === ".html") {
    sendRedirect(response, "/maintenance", requestUrl.search);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, () => {
  console.log(`Dubai Cares local site: http://localhost:${port}/`);
});
