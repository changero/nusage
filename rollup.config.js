import babel from "@rollup/plugin-babel";

export default [
  {
    external: ["fs", "path"],
    input: "./src/index.js",
    output: {
      format: "cjs",
      file: "dist/index.js",
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
    ],
  },
];
