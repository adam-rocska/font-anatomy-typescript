import {execSync} from "child_process";
import {readdirSync, readFileSync} from "fs";
import {resolve, sep} from "path";

describe("$ font-anatomy", () => {
  const replaceExtension = (name: string, ext: string) => name.split(".").slice(0, -1).join(".") + ext;
  const specimen = readdirSync(resolve(__dirname, "specimen"))
    .map(name => ({
      name: name,
      font: resolve(__dirname, "specimen", `${name}`, name),
      json: resolve(__dirname, "specimen", `${name}`, replaceExtension(name, ".json")),
      md: resolve(__dirname, "specimen", `${name}`, replaceExtension(name, ".md")),
    }));

  it("should fail when no input is provided", () => {
    expect(() => execSync('font-anatomy')).toThrow();
  });

  describe.each(specimen)("when provided a valid input", specimen => {
    const encoding: BufferEncoding = "binary";
    const input = readFileSync(specimen.font, {encoding});

    it("should yield a json by default.", () => {
      expect(execSync('font-anatomy', {input, encoding}))
        .toEqual(readFileSync(specimen.json, {encoding}));
    });

    it("should yield an md when explicitly stated.", () => {
      expect(execSync('font-anatomy -o md', {input, encoding}))
        .toEqual(readFileSync(specimen.md, {encoding}));
    });

    it("should yield a json when explicitly stated.", () => {
      expect(execSync('font-anatomy --output-format=md', {input, encoding}))
        .toEqual(readFileSync(specimen.json, {encoding}));
    });
  });
});
