import cleaner from "rollup-plugin-cleaner";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import progress from "rollup-plugin-progress";
import typescript from "rollup-plugin-typescript2";
// import { terser } from "rollup-plugin-terser";

export default {
  input: "index.ts",
  output: [
    {
      // CommonJS Output
      file: "./dist/index.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      // Browser / ES6 output
      file: "./dist/index.es.js",
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    cleaner({
      targets: [
        "./dist/",
      ],
    }),
    progress(),
    external(),
    resolve(),
    typescript({
      tsconfig: "rollup.tsconfig.json",
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs(),
    // terser({
    //   ecma: 5,
    // }),
    copy({
      targets: [
        { src: "examples/*", dest: "dist/examples" },
      ],
    })
  ],
};