import { marked } from "marked";
import { serveDir } from "@std/http";
import { basename } from "@std/path";

import { generateHtml } from "./utils.ts";

export function serve(port = 5566) {
  const currentDir = Deno.cwd();
  const title = basename(currentDir);

  console.log("Serving README.md converted result...");

  Deno.serve({ port }, async (req) => {
    const url = new URL(req.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      try {
        const markdown = await Deno.readTextFile("./README.md");
        const html = await marked.parse(markdown);
        const fullHtml = generateHtml(html, title);

        return new Response(fullHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-cache",
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return new Response(`Error: ${message}`, {
          status: 500,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    }

    return serveDir(req, {
      fsRoot: ".",
      quiet: true,
    });
  });
}

if (import.meta.main) {
  serve();
}
