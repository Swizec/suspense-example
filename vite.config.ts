/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        includeSource: ["src/**/*.{js,ts,tsx}"],
    },
    define: {
        "import.meta.vitest": "undefined",
    },
});
