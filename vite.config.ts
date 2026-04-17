import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { blocksThemePlugin } from "./blocks-plugin/index";

export default defineConfig({
  plugins: [react(), blocksThemePlugin()],
});
