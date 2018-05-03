import json from 'rollup-plugin-json'

export default {
  input: 'dist/src/brolog.js',
  output: {
    file: 'bundles/brolog.es6.umd.js',
    name: 'window',
    sourcemap: true,
    format: 'umd',
    banner: '/* Brolog version ' + require('./package.json').version + ' */',
    footer: '/* https://github.com/zixia */',
  },
  plugins: [
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      // include: 'node_modules/**',  // Default: undefined
      // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
      preferConst: true, // Default: false
    })
  ]
}
