const { build } = require("esbuild");
const chokidar = require("chokidar");
const { exec } = require("child_process");

let serverProcess;

const startServer = () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  serverProcess = exec("node dist/index.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
  });
};

const buildAndStartServer = () => {
  build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    logLevel: "info",
    outfile: "dist/index.js",
  })
    .then(() => {
      startServer();
    })
    .catch(() => process.exit(1));
};

// Initial build and start server
buildAndStartServer();

// Watch for changes
chokidar.watch("src/**/*.{ts,js}").on("change", () => {
  console.log("File change detected. Rebuilding...");
  buildAndStartServer();
});
