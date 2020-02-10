import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import image from '@rollup/plugin-image';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {

  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    globals: {
      "@babel/runtime/regenerator": "regeneratorRuntime"
    }
  },
  plugins: [
    // commonjs(),
    json(),
    image(),
    // nodePolyfills(),
    // resolve({
    //   modulesOnly: true
    // }),
    // babel({
    //   "babelrc": false,
    //   "runtimeHelpers": true,
    //   "plugins": [
    //     "@babel/plugin-transform-async-to-generator",
    //     "@babel/plugin-transform-regenerator",
    //     ["@babel/plugin-transform-runtime", {
    //       "helpers": true,
    //       "regenerator": true
    //     }]
    //   ],
    //   "presets": [
    //     "@babel/preset-env"
    //   ],
    //   exclude: 'node_modules/**',
    // })
  ]
}
