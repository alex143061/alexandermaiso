import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";

const traverse = _traverse.default ?? _traverse;

const SRC = join(process.cwd(), "src");

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(SRC).filter((f) => [".js", ".jsx"].includes(extname(f)));
let total = 0;

const GLOBALS = new Set([
  "undefined", "NaN", "Infinity", "globalThis", "window", "document",
  "console", "Math", "JSON", "Object", "Array", "String", "Number", "Boolean",
  "Date", "Promise", "Symbol", "Map", "Set", "WeakMap", "WeakSet", "Error",
  "TypeError", "RangeError", "RegExp", "parseInt", "parseFloat", "isNaN",
  "isFinite", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "requestAnimationFrame", "cancelAnimationFrame", "fetch", "structuredClone",
  "Intl", "BigInt", "encodeURIComponent", "decodeURIComponent", "location",
  "navigator", "history", "localStorage", "sessionStorage", "process", "URL",
  "FormData", "Blob", "File", "FileReader", "ResizeObserver", "IntersectionObserver",
  "MutationObserver", "CustomEvent", "Event", "HTMLElement", "Element", "Node",
  "CSS", "performance", "crypto", "self", "top", "parent", "frames", "arguments",
  "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array",
  "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray",
  "ArrayBuffer", "DataView", "BigInt64Array", "BigUint64Array",
  "alert", "confirm", "prompt", "atob", "btoa", "escape", "unescape",
]);

/**
 * A reference is only reported if it is not a global, not a local binding, and
 * not a JSX intrinsic (lowercase) element name.
 */

for (const file of files) {
  const code = readFileSync(file, "utf8");
  let ast;
  try {
    ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
  } catch (e) {
    console.log(`PARSE ERROR  ${file}: ${e.message}`);
    total++;
    continue;
  }

  const unresolved = new Map();

  traverse(ast, {
    ReferencedIdentifier(path) {
      const name = path.node.name;
      if (GLOBALS.has(name)) return;
      if (path.scope.hasBinding(name, /* noGlobals */ true)) return;
      // JSX member expressions reference the object (e.g. <Foo.Bar /> -> Foo)
      const line = path.node.loc?.start?.line;
      if (!unresolved.has(name)) unresolved.set(name, line);
    },
  });

  if (unresolved.size) {
    console.log(`\n${file}`);
    for (const [name, line] of unresolved) {
      console.log(`  line ${line}: ${name}`);
    }
    total += unresolved.size;
  }
}

console.log(`\n=== ${total} unresolved reference(s) ===`);
process.exit(total === 0 ? 0 : 1);
