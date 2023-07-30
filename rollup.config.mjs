import pkg from "./package.json" assert { type: "json" };
import json from "@rollup/plugin-json";
import terser from '@rollup/plugin-terser';
// import * as git from "git-rev-sync";

const IIFE_FILENAME = `${pkg.main}.iife.js`;
const CJS_FILENAME = pkg.main;
const ES_FILENAME = pkg.module;
console.debug(pkg.main, pkg.module);
let input, output;


// const outro = `
// __info__.date = '${new Date().toISOString()}';
// __info__.hash = '${git.short()}';
// __info__.url = 'https://github.com/telesoho/owl-ui';
// `;

const outro = `
__info__.url = 'https://github.com/telesoho/owl-ui';
`;

/**
 * Generate from a string depicting a path a new path for the minified version.
 * @param {string} pkgFileName file name
 */
function addSuffix(pkgFileName, suffix) {
  const parts = pkgFileName.split('.');
  parts.splice(parts.length - 1, 0, suffix);
  return parts.join('.');
}


/**
 * Get the rollup config based on the arguments
 * @param {string} format format of the bundle
 * @param {string} generatedFileName generated file name
 * @param {boolean} minified should it be minified
 */
function getConfigForFormat(format, generatedFileName, outro, minified = false) {
  return {
    file: minified ? addSuffix(generatedFileName, "min") : generatedFileName,
    format: format,
    name: pkg.name,
    extend: true,
    outro: outro,
    freeze: false,
    plugins: minified ? [terser()] : [],
    indent: '  ', // indent with 2 spaces
  };
}


switch (process.argv[4]) {
  case "runtime":
    input = "src/runtime/index.js";
    output = [
      getConfigForFormat('esm', addSuffix(ES_FILENAME, 'runtime'), outro),
      getConfigForFormat('cjs', addSuffix(CJS_FILENAME, 'runtime'), outro),
      getConfigForFormat('iife', addSuffix(IIFE_FILENAME, 'runtime'), outro),
      getConfigForFormat('iife', addSuffix(IIFE_FILENAME, 'runtime'), outro, true),
    ]
    break;
  default:
    input = "src/index.js";
    output = [
      getConfigForFormat('esm', ES_FILENAME, outro),
      getConfigForFormat('cjs', CJS_FILENAME, outro),
      getConfigForFormat('iife', IIFE_FILENAME, outro),
      getConfigForFormat('iife', IIFE_FILENAME, outro, true),
    ]
}

export default [
  {
    input,
    output,
    plugins: [json()]
  }
];
