export default {
  entry: './deploy/toastr.js',
  dest: './deploy/toastr.umd.js',
  format: 'umd',
  moduleName: 'toastrng2',
  globals: {
    '@angular/core': 'ng.core',
  }
};