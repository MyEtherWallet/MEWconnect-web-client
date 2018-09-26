import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
export default {

  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
    })
  ]
}
