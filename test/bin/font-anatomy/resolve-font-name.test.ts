import { describe, expect, it } from "vitest";
import { resolveFontName, resolveLocalizedName } from "../../../src/bin/resolve-font-name";

describe("resolveLocalizedName", () => {
  it("prefers English translations", () => {
    expect(resolveLocalizedName({
      hu: "Csalad",
      "en-US": "Family",
    })).toBe("Family");
  });

  it("falls back to the first available translation", () => {
    expect(resolveLocalizedName({
      hu: "Csalad",
      de: "Familie",
    })).toBe("Csalad");
  });
});

describe("resolveFontName", () => {
  it("reads the legacy top-level opentype.js name table shape", () => {
    expect(resolveFontName({
      fullName: {
        en: "Noto Sans Regular",
      },
    }, "fullName")).toBe("Noto Sans Regular");
  });

  it("reads the current platform-scoped opentype.js name table shape", () => {
    expect(resolveFontName({
      windows: {
        fullName: {
          en: "Poppins Medium Italic",
        },
      },
    }, "fullName")).toBe("Poppins Medium Italic");
  });

  it("uses the preferred platform order when multiple platforms exist", () => {
    expect(resolveFontName({
      macintosh: {
        fullName: {
          en: "Macintosh Name",
        },
      },
      windows: {
        fullName: {
          en: "Windows Name",
        },
      },
    }, "fullName")).toBe("Windows Name");
  });

  it("returns an empty string for missing names", () => {
    expect(resolveFontName({
      windows: {},
    }, "fullName")).toBe("");
  });
});
