const sourcemaps = require('rollup-plugin-sourcemaps');

export default {
  entry: './build/toastr.js',
  dest: './deploy/toastr.js',
  format: 'es',
  moduleName: 'ngxtoastr',
  sourceMap: true,
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/platform-browser': 'ng.platformBrowser',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx'
  },
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/platform-browser',
    'rxjs/Observable',
    'rxjs/Subject'
  ],
  plugins: [
    sourcemaps()
  ]
};
