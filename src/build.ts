import { marked } from "marked";
import { ensureDir } from "@std/fs";
import { basename } from "@std/path";
import { generateHtml } from "./utils.ts";

export async function build() {
  console.log("Building site...");
  const markdown = await Deno.readTextFile("./README.md");
  const html = await marked.parse(markdown);

  const currentDir = Deno.cwd();
  const title = basename(currentDir);

  const fullHtml = generateHtml(html, title);

  await ensureDir("./dist");
  await Deno.writeTextFile("./dist/index.html", fullHtml);

  console.log(`Build complete! Title: "${title}"`);
  console.log("Output: dist/index.html");
}

if (import.meta.main) {
  try {
    await build();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Build failed:", message);
    Deno.exit(1);
  }
}