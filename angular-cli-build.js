'use strict';
const fs = require('fs');
const path = require('path');

// Import the require hook. Enables us to require TS files natively.
require('ts-node/register');


const Angular2App = require('angular-cli/lib/broccoli/angular2-app');
const Funnel = require('broccoli-funnel');
const MergeTree = require('broccoli-merge-trees');
const autoPrefixerTree = require('broccoli-autoprefixer');


module.exports = function(defaults) {
  var angularAppTree = new Angular2App(defaults, {
    sourceDir: 'src/',
    sassCompiler: {
      includePaths: [
        'src/core/style'
      ]
    },
    polyfills: [
      'vendor/core-js/client/core.js',
      'vendor/systemjs/dist/system.src.js',
      'vendor/zone.js/dist/zone.js',
    ],
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.+(js|js.map)',
      'core-js/client/core.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',
      '@angular2-material/**/*.js',
      '@types/**/*.js',
    ]
  });

  const cssAutoprefixed = autoPrefixerTree(new Funnel(angularAppTree, {
    include: [ '**/*.css' ]
  }));

  return new MergeTree([
    new Funnel('src', { include: ['**/*.scss']}),
    angularAppTree,
    cssAutoprefixed,
  ], { overwrite: true });
};
