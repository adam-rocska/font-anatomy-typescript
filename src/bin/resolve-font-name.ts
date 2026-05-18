const preferredPlatforms = ["windows", "unicode", "macintosh"];

export function resolveFontName(names: unknown, name: string): string {
  const fontNames = asRecord(names);
  if (!fontNames) return "";

  const directName = resolveLocalizedName(fontNames[name]);
  if (directName) return directName;

  for (const platform of preferredPlatforms) {
    const platformName = resolvePlatformFontName(fontNames[platform], name);
    if (platformName) return platformName;
  }

  for (const platformNames of Object.values(fontNames)) {
    const platformName = resolvePlatformFontName(platformNames, name);
    if (platformName) return platformName;
  }

  return "";
}

export function resolveLocalizedName(localizedName: unknown): string {
  if (typeof localizedName === "string") return localizedName;

  const translations = asRecord(localizedName);
  if (!translations) return "";

  const englishKey = Object
    .keys(translations)
    .find(key => /^en(?:\W|$)/i.test(key) && typeof translations[key] === "string");

  if (englishKey) return translations[englishKey] as string;

  const firstValue = Object
    .values(translations)
    .find((value): value is string => typeof value === "string");

  return firstValue ?? "";
}

function resolvePlatformFontName(platformNames: unknown, name: string): string {
  const platform = asRecord(platformNames);
  if (!platform) return "";

  return resolveLocalizedName(platform[name]);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  return value as Record<string, unknown>;
}
