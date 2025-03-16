
import path from "path"
import { defineConfig } from "vite";
import { fileURLToPath } from 'url';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(__filename), "./src"),
    },
  },
});
