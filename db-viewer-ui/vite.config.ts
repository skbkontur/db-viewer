import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        "process.env.API": "'real'",
        "process.env.enableReactTesting": "true",
        global: "window",
    },
    server: {
        proxy: {
            "/db-viewer": "http://localhost:5000",
        },
    },
    build: {
        outDir: "../DbViewer.TestApi/wwwroot",
    },
});
