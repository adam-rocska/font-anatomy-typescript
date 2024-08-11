export function error(...args: Parameters<typeof console.error>): undefined {
  console.error(...args);
}