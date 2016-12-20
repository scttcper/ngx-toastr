export default {
  entry: './deploy/toastr.js',
  dest: './deploy/toastr.umd.js',
  format: 'umd',
  moduleName: 'toastrng2',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/compiler': 'ng.compiler',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/http': 'ng.http',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx'
  }
};