import { base_path } from ".";

export const standardizePath = (path: string, noRootSlash?: boolean) => {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  if (noRootSlash && path === "/") {
    return "";
  }
  return path;
};

export const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

export const joinBase = (...paths: string[]) => {
  return pathJoin(base_path, ...paths);
};

export const trimBase = (path: string) => {
  const res = path.replace(base_path, "");
  if (res.startsWith("/")) {
    return res;
  }
  return "/" + res;
};

export const pathBase = (path: string) => {
  return path.split("/").pop();
};

export const pathDir = (path: string) => {
  return path.split("/").slice(0, -1).join("/");
};

export const encodePath = (path: string, all?: boolean) => {
  return path
    .split("/")
    .map((p) =>
      // ["#", "?", "%"].some((c) => p.includes(c)) ? encodeURIComponent(p) : p
      all
        ? encodeURIComponent(p)
        : p.replaceAll("%", "%25").replaceAll("?", "%3F").replaceAll("#", "%23")
    )
    .join("/");
};

export const ext = (path: string): string => {
  return path.split(".").pop() ?? "";
};
