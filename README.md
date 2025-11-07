# README To Site (r2s)

[![Test](https://img.shields.io/github/actions/workflow/status/EastSun5566/readme-to-site/test.yml?style=social)](https://github.com/EastSun5566/readme-to-site/actions/workflows/test.yml)

> A simple static site generator that converts README.md to HTML

## Installation

### Global Install

```sh
deno install -A -n r2s jsr:@eastsun5566/r2s
```

### Or run directly

```sh
# Serve
deno run -A jsr:@eastsun5566/r2s serve

# Build
deno run -A jsr:@eastsun5566/r2s build
```

## Usage

```sh
mkdir my-site
cd my-site

# Create a README.md
echo "# Welcome to My Site" >> README.md

# Serve locally
r2s serve

# Build static site
r2s build
```
