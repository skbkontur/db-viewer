import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    define: process.env.VITEST
        ? {}
        : {
              "process.env.API": mode === "dev" ? "'fake'" : "'real'",
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
    build: {
        outDir: "../DbViewer.TestApi/wwwroot",
        chunkSizeWarningLimit: 1024,
    },
}));
