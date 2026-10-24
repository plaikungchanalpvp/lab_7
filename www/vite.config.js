import { defineConfig } from "vite";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
const maplibreDist = dirname(
    createRequire(import.meta.url).resolve("maplibre-gl/dist/maplibre-gl.mjs")
);
function maplibreWorkerAssets() {
    return {
        name: "maplibre-worker-assets",
        apply: "build",
        generateBundle() {
            for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
                this.emitFile({
                    type: "asset",
                    fileName: `assets/${file}`,
                    source: readFileSync(join(maplibreDist, file), "utf8"),
                });
            }
        },
    };
}
export default defineConfig({
    root: "www",
    base: "/lab154377/lab_7maplibre/",
    plugins: [maplibreWorkerAssets()],
    server: {
        proxy: {
            "/geoserver": {
                target: "https://engrids.soc.cmu.ac.th",
                changeOrigin: true,
            },
        },
    },
    optimizeDeps: {
        exclude: ["maplibre-gl"],
    },
    build: {
        outDir: "../lab_7maplibre",
        emptyOutDir: true,
    }
});