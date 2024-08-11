import {execSync, spawnSync, StdioOptions} from "child_process";
import {readdirSync, readFileSync} from "fs";
import {resolve, sep} from "path";

const replaceExtension = (name: string, ext: string) => name.split(".").slice(0, -1).join(".") + ext;
const specimen = readdirSync(resolve(__dirname, "specimen"))
  .map(name => ({
    name: name,
    font: resolve(__dirname, "specimen", `${name}`, name),
    json: resolve(__dirname, "specimen", `${name}`, replaceExtension(name, ".json")),
    md: resolve(__dirname, "specimen", `${name}`, replaceExtension(name, ".md")),
  }));

describe("$ font-anatomy", () => {
  it("should fail when no input is provided", () => {
    expect(() => execSync('font-anatomy')).toThrow();
  });

  describe.each(specimen)("when provided a valid input", specimen => {
    it("should yield a json by default.", () => {
      const actual = outputOf(readFileSync(specimen.font));
      const expected = readFileSync(specimen.json);
      expect(actual.toString()).toEqual(expected.toString());
    });

    it("should yield an md when explicitly stated.", () => {
      const actual = outputOf(readFileSync(specimen.font), "--output-format=md");
      const expected = readFileSync(specimen.md);
      expect(actual.toString()).toEqual(expected.toString());
    });

    it("should yield a json when explicitly stated.", () => {
      const actual = outputOf(readFileSync(specimen.font), "--output-format=json");
      const expected = readFileSync(specimen.json);
      expect(actual.toString()).toEqual(expected.toString());
    });
  });
});

function outputOf(input: Buffer, ...args: string[]): Buffer {
  const stdio: StdioOptions = ['pipe', 'pipe', 'inherit'];
  const process = spawnSync("font-anatomy", args, {input, stdio});
  return process.stdout;
}