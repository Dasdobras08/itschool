const PROTECTED_PREFIXES = ["/inicio", "/escolher", "/nova-escola", "/painel", "/familia"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Only allow redirects to paths inside this app, never to other sites.
export function safeNextPath(next: string | null | undefined, fallback = "/inicio") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
