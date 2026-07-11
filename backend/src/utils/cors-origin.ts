const DEV_TUNNEL_HOST_SUFFIXES = [
  ".loca.lt",
  ".ngrok-free.app",
  ".ngrok.io",
  ".trycloudflare.com",
] as const;

function parseOrigin(origin: string): URL | null {
  try {
    return new URL(origin);
  } catch {
    return null;
  }
}

function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

function isDevTunnelHost(hostname: string): boolean {
  return DEV_TUNNEL_HOST_SUFFIXES.some(
    (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix),
  );
}

export function isCorsOriginAllowed(
  origin: string | undefined,
  allowedOrigins: readonly string[],
  nodeEnv: string,
): boolean {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  if (nodeEnv === "development" || nodeEnv === "test") return true;

  const parsed = parseOrigin(origin);
  if (!parsed) return false;
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  return isLocalDevHost(parsed.hostname) || isDevTunnelHost(parsed.hostname);
}