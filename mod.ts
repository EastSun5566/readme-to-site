import { parseArgs } from "@std/cli";

import { build } from "./src/build.ts";
import { serve } from "./src/serve.ts";
import denoJson from './deno.json' with { type: "json" };

const args = parseArgs(Deno.args, {
  boolean: ["help", "version"],
  alias: {
    h: "help",
    v: "version",
    p: "port",
  },
  default: {
    port: 5566,
  },
});

function showHelp() {
  console.log(`
readme-to-site v${denoJson.version}

A simple static site generator that converts README.md to HTML

USAGE:
  r2s [COMMAND] [OPTIONS]

COMMANDS:
  serve     Serve README.md converted result (default port: 5566)
  build     Build static site to dist/index.html

OPTIONS:
  -p, --port <PORT>    Port number for serve command
  -h, --help           Show this help message
  -v, --version        Show version

EXAMPLES:
  # Serve
  r2s
  r2s serve
  r2s serve --port 3000

  # Build
  r2s build
`);
}

async function main() {
  if (args.help) {
    showHelp();
    Deno.exit(0);
  }

  if (args.version) {
    console.log(`v${denoJson.version}`);
    Deno.exit(0);
  }

  const command = args._[0]?.toString() || "serve";
  try {
    switch (command) {
      case "serve": {
        serve(args.port as number);
        break;
      }
      case "build": {
        await build();
        break;
      }
      default:
        console.error(`Unknown command: ${command}`);
        console.log("Run 'r2s --help' for usage");
        Deno.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error:", message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
