import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    watch: {
      exclude: 'node_modules/**',
    },
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    alias({
      '@utils': 'src/utils',
    }),
    uglify(),
  ],
};
