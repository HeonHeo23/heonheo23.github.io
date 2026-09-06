import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  plugins: [
    { enforce: "pre", ...mdx({ providerImportSource: "@mdx-js/react" }) },
    react({ include: /\.(?:js|jsx|ts|tsx)$/ }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
