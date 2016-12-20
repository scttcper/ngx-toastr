const webpack = require('webpack');

function webpackCallBack(taskName) {
  return function(err, stats) {
    if (err) throw err;
    console.log('Rollup Finished');
  }
}

function ngExternal(ns) {
    const ng2Ns = `@angular/${ns}`;
    return {root: ['ng', ns], commonjs: ng2Ns, commonjs2: ng2Ns, amd: ng2Ns};
  }

function rxjsExternal(context, request, cb) {
  if (/^rxjs\/add\/observable\//.test(request)) {
    return cb(null, {root: ['Rx', 'Observable'], commonjs: request, commonjs2: request, amd: request});
  } else if (/^rxjs\/add\/operator\//.test(request)) {
    return cb(null, {root: ['Rx', 'Observable', 'prototype'], commonjs: request, commonjs2: request, amd: request});
  } else if (/^rxjs\//.test(request)) {
    return cb(null, {root: ['Rx'], commonjs: request, commonjs2: request, amd: request});
  }
  cb();
}

webpack(
  {
    entry: './deploy/toastr.js',
    output: {filename: './deploy/toastr.umd.js', library: 'toastrng2', libraryTarget: 'umd'},
    devtool: 'source-map',
    externals: [
      {
        '@angular/core': ngExternal('core'),
        '@angular/common': ngExternal('common'),
        '@angular/forms': ngExternal('forms')
      },
      rxjsExternal
    ]
  },
  webpackCallBack('webpack', ()=>console.log('webpacked')));
