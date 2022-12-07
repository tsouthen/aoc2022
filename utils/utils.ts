export function readFile(url: string | URL, base?: string | URL | undefined): Array<string> {
  const data = Deno.readFileSync(new URL(url, base));
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(data).split("\n");
}
