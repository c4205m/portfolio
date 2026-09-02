import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { adminApi } from "./plugins/admin-api";

// Deployed to GitHub Pages under /portfolio/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react(), adminApi()],
});
