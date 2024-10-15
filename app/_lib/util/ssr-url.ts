import { headers } from "next/headers";

export function getBaseURL() {
  if (process.env.NODE_ENV === "development") {
    const urlString = getURL();
    const url = new URL(urlString);
    return `${url.protocol}//${process.env.URL}/`;
  }
  return `http://${process.env.URL}/`;
}

export function _getBaseURLDirectly() {
  return `http://${process.env.URL}/`;
}

export function getPublicURL() {
  if (!process.env.PUBLIC_URL) throw new Error("PUBLIC_URL needed");
  return process.env.PUBLIC_URL;
}

export function getPathname() {
  return headers().get("jw-pathname") || "";
}

export function getURL() {
  return headers().get("jw-url") || "";
}
