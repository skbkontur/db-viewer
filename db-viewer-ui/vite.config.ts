import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isTestMode = mode === "test";
    const isDevMode = mode === "dev";
    return {
        plugins: [react()],
        define: process.env.VITEST
            ? {}
            : {
                  "process.env.API": isDevMode ? "'fake'" : "'real'",
                  "process.env.enableReactTesting": "true",
                  global: "window",
              },
        server: {
            proxy: {
                "/db-viewer": "http://localhost:5000",
            },
        },
        test: {
            include: ["./tests/**/*.tsx"],
            globals: false,
            environment: "jsdom",
        },
        esbuild: isTestMode
            ? {
                  minifyIdentifiers: false,
                  keepNames: true,
              }
            : {},
        build: {
            minify: "esbuild",
            outDir: isTestMode ? "../DbViewer.TestApi/wwwroot" : "./dist",
            chunkSizeWarningLimit: isTestMode ? 2048 : 1024,
        },
    };
});
