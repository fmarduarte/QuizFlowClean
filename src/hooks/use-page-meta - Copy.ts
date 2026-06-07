import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export interface PageMetaOptions {
  title: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string | undefined) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string | undefined) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageMeta({
  title,
  description,
  canonical,
  robots = "index, follow",
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
}: PageMetaOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:alt", `${SITE_NAME} — AI Quiz Funnel Builder`);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);
    upsertLink("canonical", canonical ? absoluteUrl(canonical) : undefined);
    if (canonical) {
      upsertMeta("property", "og:url", absoluteUrl(canonical));
    }
  }, [title, description, canonical, robots, ogType, ogImage]);
}
