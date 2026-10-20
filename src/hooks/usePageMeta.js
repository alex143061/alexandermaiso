import { useEffect } from "react";

const SITE_URL = "https://alexandermaiso.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const DEFAULT_META = {
  title: "Alexander Maiso (Alex) | Full-Stack Developer, Computer Engineer & IoT Developer Portfolio",
  description:
    "Alexander Maiso, also known as Alex, is a Computer Engineer and Full-Stack Developer from the Philippines. Skilled in React, Next.js, Laravel, WordPress, Node.js, Python, IoT (ESP32, Arduino), and AI. Explore his portfolio, projects, blog, and technical skills.",
  path: "/",
};

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets the document title and the SEO / Open Graph / Twitter meta tags for the
 * current route, and restores the defaults on unmount.
 */
export const usePageMeta = ({
  title = DEFAULT_META.title,
  description = DEFAULT_META.description,
  path = DEFAULT_META.path,
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
} = {}) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1",
    });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

    upsertLink("canonical", url);
  }, [title, description, path, image, type, noIndex]);
};

export { SITE_URL, DEFAULT_IMAGE };
