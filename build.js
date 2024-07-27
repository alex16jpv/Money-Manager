const { build } = require("esbuild");

build({
  entryPoints: ["src/server.prod.ts"],
  bundle: true,
  platform: "node",
  logLevel: "info",
  outfile: "dist/index.js",
});
