/**
 * Runtime smoke test.
 *
 * Renders each page with react-dom/server inside jsdom and asserts that it
 * does not throw. This catches errors that a production build cannot, such as
 * a JSX component reference that was never imported (ReferenceError at render
 * time -> blank page).
 *
 * Run with:  node scripts/smoke-render.mjs
 */
import { JSDOM } from "jsdom";
import { writeFileSync, rmSync } from "fs";
import { join } from "path";
import { build } from "esbuild";

// --- Set up a DOM before React is imported -------------------------------
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

global.window = dom.window;
global.document = dom.window.document;
// Node 22+ defines `navigator` as a getter-only global, so it must be
// redefined rather than assigned.
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
  writable: true,
});
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.SVGElement = dom.window.SVGElement;
global.getComputedStyle = dom.window.getComputedStyle;
global.requestAnimationFrame = dom.window.requestAnimationFrame
  ?? ((cb) => setTimeout(() => cb(Date.now()), 0));
global.cancelAnimationFrame = dom.window.cancelAnimationFrame ?? clearTimeout;
global.matchMedia =
  dom.window.matchMedia ??
  (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
// jsdom does not implement matchMedia; three.js requires it to exist.
dom.window.matchMedia = global.matchMedia;
global.MutationObserver = dom.window.MutationObserver;
global.ResizeObserver = dom.window.ResizeObserver ?? class { observe() {} unobserve() {} disconnect() {} };
global.IntersectionObserver = dom.window.IntersectionObserver ?? class { observe() {} unobserve() {} disconnect() {} };
// react-spring / three.js probe these on the window object itself.
dom.window.ResizeObserver = global.ResizeObserver;
dom.window.IntersectionObserver = global.IntersectionObserver;
dom.window.MutationObserver = global.MutationObserver;
global.scrollTo = dom.window.scrollTo ?? (() => {});
global.screen = dom.window.screen;
global.IS_REACT_ACT_ENVIRONMENT = false;

// three.js / R3F probe for WebGL support.
dom.window.HTMLCanvasElement.prototype.getContext = () => null;

const ROOT = process.cwd();
const ENTRY = join(ROOT, "scripts", ".smoke-entry.jsx");

const PAGES = [
  ["Dashboard", "src/pages/Dashboard.jsx", [
    "Project Dashboard",
    "Total Projects",
    "Completed",
    "In Progress",
    "ROADWATCH",
    "New Project",
    "Search projects",
  ]],
  ["Login", "src/pages/Login.jsx", ["Login", "Password", "Email"]],
  ["Register", "src/pages/Register.jsx", ["Register", "Password", "Email"]],
  ["Blog", "src/pages/blog.jsx", []],
];

// Stub out the heavy 3D canvas so the smoke test does not need WebGL.
const STUBS = {
  "src/components/canvas/Stars.jsx": `
    import React from "react";
    export default function StarsCanvas() { return null; }
  `,
  "src/components/canvas/Earth.jsx": `
    import React from "react";
    export default function Earth() { return null; }
  `,
  "src/components/canvas/Tico.jsx": `
    import React from "react";
    export default function Tico() { return null; }
  `,
};

async function main() {
  const plugins = [];
  for (const [path, contents] of Object.entries(STUBS)) {
    plugins.push({
      name: "stub",
      setup(build) {
        build.onResolve({ filter: /canvas[\\/](Stars|Earth|Tico)\.jsx$/ }, (args) => ({
          path: args.path,
          namespace: "stub",
        }));
        build.onLoad({ filter: /.*/, namespace: "stub" }, (args) => {
          const key = Object.keys(STUBS).find((k) => k.endsWith(args.path.split("\\").pop()));
          return { contents: STUBS[key], loader: "jsx" };
        });
      },
    });
  }

  // Vite resolves "/src/..." as project-root-relative; esbuild needs an alias.
  const aliasPlugin = {
    name: "vite-root-alias",
    setup(build) {
      build.onResolve({ filter: /^\/src\// }, (args) => ({
        path: join(ROOT, args.path.replace(/^\//, "")),
      }));
    },
  };

  let failures = 0;

  for (const [name, rel, expectations] of PAGES) {
    const entry = `
      import React from "react";
      import { createRoot } from "react-dom/client";
      import { flushSync } from "react-dom";
      import { MemoryRouter } from "react-router-dom";
      import Page from ${JSON.stringify(join(ROOT, rel))};
      export function render() {
        const host = document.createElement("div");
        document.body.appendChild(host);
        const root = createRoot(host);
        flushSync(() => {
          root.render(
            <MemoryRouter>
              <Page />
            </MemoryRouter>
          );
        });
        const html = document.body.innerHTML;
        root.unmount();
        return html;
      }
    `;
    writeFileSync(ENTRY, entry);

    let code;
    try {
      const result = await build({
        entryPoints: [ENTRY],
        bundle: true,
        write: false,
        outfile: join(ROOT, "scripts", ".smoke-out.js"),
        format: "cjs",
        platform: "node",
        jsx: "automatic",
        loader: {
          ".js": "jsx",
          ".jsx": "jsx",
          ".webp": "dataurl",
          ".png": "dataurl",
          ".jpg": "dataurl",
          ".jpeg": "dataurl",
          ".svg": "dataurl",
          ".pdf": "dataurl",
          ".glb": "dataurl",
          ".gltf": "dataurl",
          ".css": "text",
        },
        define: { "process.env.NODE_ENV": '"development"' },
        plugins: [...plugins, aliasPlugin],
        // Node built-ins must stay external so `require()` calls resolve.
        external: [
          "stream", "util", "path", "fs", "os", "crypto", "http", "https",
          "zlib", "buffer", "events", "url", "assert", "tty", "module",
          "worker_threads", "string_decoder", "net", "tls", "child_process",
          "vm", "v8", "perf_hooks", "punycode", "querystring",
        ],
        logLevel: "silent",
      });
      code = result.outputFiles[0].text;
    } catch (err) {
      console.log(`FAIL  ${name}: build error -> ${err.errors?.[0]?.text ?? err.message}`);
      failures++;
      continue;
    }

    let html = "";
    try {
      const OUT = join(ROOT, "scripts", `.smoke-out-${name}.cjs`);
      writeFileSync(OUT, code);
      // On Windows an absolute path must be a file:// URL for the ESM loader.
      const { pathToFileURL } = await import("url");
      const mod = await import(`${pathToFileURL(OUT).href}?t=${Date.now()}`);
      html = mod.render();
      rmSync(OUT, { force: true });
      if (!html || html.length < 100) {
        console.log(`FAIL  ${name}: rendered empty output`);
        failures++;
        continue;
      }
      const missing = expectations.filter((t) => !html.includes(t));
      if (missing.length) {
        console.log(`FAIL  ${name}: missing expected content -> ${missing.join(", ")}`);
        failures++;
        continue;
      }
      console.log(`OK    ${name}: rendered ${html.length} chars`);
    } catch (err) {
      console.log(`FAIL  ${name}: ${err.message}`);
      failures++;
    }
  }

  rmSync(ENTRY, { force: true });
  console.log(failures === 0 ? "\nAll pages rendered." : `\n${failures} page(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
