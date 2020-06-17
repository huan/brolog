export default {
  input: 'dist/brolog.js',
  output: {
    banner: '/* Brolog version ' + require('./package.json').version + ' */',
    extend: true, // Issue #69
    file: 'bundles/brolog.es6.umd.js',
    footer: '/* https://github.com/huan */',
    format: 'umd',
    name: 'window',
    sourcemap: true,
  },
}
