export default {
  entry: 'dist/src/brolog.js',
  dest: 'bundles/brolog.es6.umd.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'window',
  banner: '/* Brolog version ' + require('./package.json').version + ' */',
  footer: '/* https://git.io/zixia/ */'
}
