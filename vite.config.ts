import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/smart-search.ts",
      name: "SmartSearch",
      fileName: (format) => `smart-search.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
