export function resolveImage(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.VITE_FRONTEND_ORIGIN || window.location.origin;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
