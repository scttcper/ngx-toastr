export default {
  entry: './deploy/toastr.js',
  dest: './deploy/toastr.umd.js',
  format: 'umd',
  moduleName: 'toastrng2',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/platform-browser': 'ng.platformBrowser',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx'
  }
};
