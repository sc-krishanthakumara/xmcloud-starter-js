type ClassNameInput = string | false | null | undefined;
type ClassNameRecord = Record<string, boolean>;

/** Joins class names and object maps (clsx-style); no tailwind-merge in this starter. */
export function cn(...inputs: (ClassNameInput | ClassNameRecord)[]): string {
  const parts: string[] = [];
  for (const input of inputs) {
    if (input == null || input === false) continue;
    if (typeof input === 'string') {
      if (input) parts.push(input);
    } else {
      for (const [key, on] of Object.entries(input)) {
        if (on) parts.push(key);
      }
    }
  }
  return parts.join(' ');
}

export function getBaseUrl(host?: string | null): string {
  if (host) {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    return `${protocol}://${host}`;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  );
}

export function getFullUrl(path: string, host?: string | null): string {
  const baseUrl = getBaseUrl(host);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
