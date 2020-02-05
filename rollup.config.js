import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import image from '@rollup/plugin-image';

export default {

  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    image(),
    babel({
      plugins: ['external-helpers'],
      exclude: 'node_modules/**',
    })
  ]
}
