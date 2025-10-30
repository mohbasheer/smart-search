const { esbuildPlugin } = require("@web/dev-server-esbuild");
const { playwrightLauncher } = require("@web/test-runner-playwright");

module.exports = {
  files: "src/**/*.test.ts",

  nodeResolve: {
    exportConditions: ["development"],
  },

  browsers: [playwrightLauncher({ product: "chromium" })],

  plugins: [
    esbuildPlugin({
      ts: true,
      target: "auto",
      tsconfig: "./tsconfig.json",
    }),
  ],

  testsStartTimeout: 60000,
};
