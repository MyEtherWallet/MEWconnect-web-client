import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
export default {
  input: 'src/index.js',
  output: [
    {
      format: 'esm',
      dir: 'dist/esm/'
    },
    { format: 'cjs', dir: 'dist/cjs/' }
  ],
  plugins: [json(), image()]
};
