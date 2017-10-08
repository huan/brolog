export default {
  entry: 'dist/brolog.js',
  dest: 'bundles/brolog.es6.umd.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'window',
  banner: '/* Brolog version ' + require('./package.json').version + ' */',
  footer: '/* https://github.com/zixia */'
}
