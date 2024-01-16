import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isDevMode = mode === "dev";
    return {
        plugins: [react()],
        define: process.env.VITEST
            ? {}
            : {
                  "process.env.API": isDevMode ? "'fake'" : "'real'",
                  "process.env.enableReactTesting": "true",
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
        esbuild: {
            minifyIdentifiers: false,
            keepNames: true,
        },
        build: {
            minify: "esbuild",
            outDir: "../DbViewer.TestApi/wwwroot",
            chunkSizeWarningLimit: 2048,
        },
    };
});
