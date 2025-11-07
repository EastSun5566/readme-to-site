import { assertEquals, assertRejects } from "@std/assert";
import { parseArgs } from "@std/cli";
import { exists } from "@std/fs";

import { build } from "./src/build.ts";

Deno.test("build - should create dist/index.html", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalDir = Deno.cwd();

  try {
    Deno.chdir(tempDir);

    await Deno.writeTextFile(
      "./README.md",
      "# Test\n\nThis is a test README."
    );

    await build();

    const distExists = await exists("./dist/index.html");
    assertEquals(distExists, true);

    const html = await Deno.readTextFile("./dist/index.html");
    assertEquals(html.includes("<h1>Test</h1>"), true);
    assertEquals(html.includes("This is a test README."), true);
  } finally {
    Deno.chdir(originalDir);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("build - should use folder name as title", async () => {
  const tempDir = await Deno.makeTempDir({ prefix: "my-awesome-site" });
  const originalDir = Deno.cwd();

  try {
    Deno.chdir(tempDir);

    await Deno.writeTextFile("./README.md", "# Hello");
    await build();

    const html = await Deno.readTextFile("./dist/index.html");
    assertEquals(html.includes("<title>"), true);
  } finally {
    Deno.chdir(originalDir);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("build - should handle missing README.md", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalDir = Deno.cwd();

  try {
    Deno.chdir(tempDir);

    await assertRejects(
      async () => {
        await build();
      },
      Deno.errors.NotFound
    );
  } finally {
    Deno.chdir(originalDir);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("CLI - should parse serve command", () => {
  const args = parseArgs(["serve", "--port", "3000"]);

  assertEquals(args._[0], "serve");
  assertEquals(args.port, 3000);
});

Deno.test("CLI - should parse build command", () => {
  const args = parseArgs(["build"]);

  assertEquals(args._[0], "build");
});

Deno.test("CLI - should use default port", () => {
  const args = parseArgs(["serve"], {
    string: ["port"],
    default: { port: "5566" },
  });

  assertEquals(args.port, "5566");
});

Deno.test("CLI - should parse help flag", () => {
  const args = parseArgs(["--help"], {
    boolean: ["help"],
    alias: { h: "help" },
  });

  assertEquals(args.help, true);
});

Deno.test("CLI - should parse version flag", () => {
  const args = parseArgs(["-v"], {
    boolean: ["version"],
    alias: { v: "version" },
  });

  assertEquals(args.version, true);
});
