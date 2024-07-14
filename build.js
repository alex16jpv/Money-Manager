const { build } = require("esbuild");

build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  logLevel: "info",
  outfile: "dist/index.js",
});
