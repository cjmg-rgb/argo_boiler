import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  cacheDir: ".vite_cache",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
