import {execSync} from "child_process";
import {readdirSync, readFileSync} from "fs";
import {resolve, sep} from "path";

describe("$ font-anatomy", () => {
  const inputs = readdirSync(resolve(__dirname, "inputs"));

  it("should fail when no input is provided", () => {
    expect(() => execSync('font-anatomy')).toThrow();
  });

  describe.each(inputs)("cat %s | font-anatomy > outputs/%s", (input) => {
    it("should yield a JSON by default.", () => {
      const inputPath = resolve(__dirname, "inputs", input);
      const contents = readFileSync(inputPath);
      const resultJson = execSync('font-anatomy', {input: contents}).toString();
      const expectedJson = outputOf(input, "json");
      const actual = JSON.parse(resultJson);
      const expected = JSON.parse(expectedJson);
      expect(actual).toEqual(expected);
    });
  });

  describe.each(inputs)("cat %s | font-anatomy -o md > outputs/%s.md", (input) => {
    it("should yield a Markdown table when requested.", () => {
      const inputPath = resolve(__dirname, "inputs", input);
      const contents = readFileSync(inputPath);
      const resultMd = execSync('font-anatomy -o md', {input: contents}).toString();
      const expectedMd = outputOf(input, "md");
      expect(resultMd).toBe(expectedMd);
    });
  });

  describe.each(inputs)("cat %s | font-anatomy --output-format=md > outputs/%s.md", (input) => {
    it("should yield a Markdown table when requested.", () => {
      const inputPath = resolve(__dirname, "inputs", input);
      const contents = readFileSync(inputPath);
      const resultMd = execSync('font-anatomy --output-format=md', {input: contents}).toString();
      const expectedMd = outputOf(input, "md");
      expect(resultMd).toBe(expectedMd);
    });
  });

  describe.each(inputs)("cat %s | font-anatomy -o json > outputs/%s.md", (input) => {
    it("should yield a Markdown table when requested.", () => {
      const inputPath = resolve(__dirname, "inputs", input);
      const contents = readFileSync(inputPath);
      const resultMd = execSync('font-anatomy --output-format=json', {input: contents}).toString();
      const expectedMd = outputOf(input, "json");
      expect(resultMd).toBe(expectedMd);
    });
  });

  describe.each(inputs)("cat %s | font-anatomy --output-format=json > outputs/%s.md", (input) => {
    it("should yield a Markdown table when requested.", () => {
      const inputPath = resolve(__dirname, "inputs", input);
      const contents = readFileSync(inputPath);
      const resultMd = execSync('font-anatomy --output-format=json', {input: contents}).toString();
      const expectedMd = outputOf(input, "json");
      expect(resultMd).toBe(expectedMd);
    });
  });
});

function outputOf(input: string, type: "json" | "md"): string {
  const name = input.split(sep).pop()?.split(".").slice(0, -1).join(".");
  const output = resolve(__dirname, "outputs", `${name}.${type}`);
  return readFileSync(output, "utf8");
}
