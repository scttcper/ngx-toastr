/* tslint:disable:import-blacklist */
// from https://github.com/angular/angularfire2/blob/master/tools/build.js
import { rollup } from 'rollup';
import { spawn } from 'child_process';
import { Observable } from 'rxjs';
import { copy } from 'fs-extra';
import * as copyfiles from 'copy';
import * as filesize from 'rollup-plugin-filesize';
import * as sourcemaps from 'rollup-plugin-sourcemaps';

const pkg = require(`${process.cwd()}/package.json`);

// Rollup globals
const GLOBALS = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/animations': 'ng.animations',
  '@angular/platform-browser': 'ng.platformBrowser',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subscription': 'Rx',
};

// Constants for running typescript commands
const NGC = './node_modules/.bin/ngc';
const TSC_ARGS = (config = 'build') => [`-p`, `${process.cwd()}/src/lib/tsconfig-${config}.json`];

/**
 * Create an Observable of a spawned child process.
 * @param {string} command
 * @param {string[]} args
 */
function spawnObservable(command, args) {
  return Observable.create(observer => {
    const cmd = spawn(command, args);
    observer.next(''); // hack to kick things off, not every command will have a stdout
    cmd.stdout.on('data', (data) => { observer.next(data.toString()); });
    cmd.stderr.on('data', (data) => { observer.error(data.toString()); });
    cmd.on('close', (data) => { observer.complete(); });
  });
}

function generateBundle(input, file, globals, name, format) {
  const plugins = [
    sourcemaps(),
    filesize(),
  ];
  return rollup({
    input,
    external: Object.keys(globals),
    file,
    plugins,
  }).then(bundle => {
    console.log(file);
    return bundle.write({
      file,
      name,
      globals,
      format,
      sourcemap: true,
    });
  });
}

function createUmd(globals) {
  const name = 'ngx-toastr';
  const entry = `${process.cwd()}/dist/es5/index.js`;
  return generateBundle(
    entry,
    `${process.cwd()}/dist/packages-dist/toastr.umd.js`,
    globals,
    name,
    'umd',
  );
}

function createEs(globals, target) {
  const name = 'ngx-toastr';
  const entry = `${process.cwd()}/dist/${target}/index.js`;
  return generateBundle(
    entry,
    `${process.cwd()}/dist/packages-dist/toastr.${target}.js`,
    globals,
    name,
    'es',
  );
}

function getVersions() {
  const paths = [
    `${process.cwd()}/dist/packages-dist/package.json`,
  ];
  return paths
    .map(path => require(path))
    .map(pkgs => pkgs.version);
}

function verifyVersions() {
  const versions = getVersions();
  console.log(versions);
  versions.map(version => {
    if (version !== pkg.version) {
      throw new Error('Versions mistmatch');
    }
  });
}

function buildModule(globals) {
  const es2015$ = spawnObservable(NGC, TSC_ARGS());
  const esm$ = spawnObservable(NGC, TSC_ARGS('esm'));
  return Observable
    .forkJoin(es2015$, esm$);
}

function createBundles(globals) {
  return Observable
    .forkJoin(
      Observable.from(createUmd(globals)),
      Observable.from(createEs(globals, 'es2015')),
      Observable.from(createEs(globals, 'es5')),
    );
}

function copyFiles() {
  const copyAll: ((s: string, s1: string) => any) = Observable.bindCallback(copyfiles);
  return Observable
    .forkJoin(
      copyAll(`${process.cwd()}/dist/es5/**/*.d.ts`, `${process.cwd()}/dist/packages-dist`),
      copyAll(`${process.cwd()}/dist/es5/**/*.metadata.json`, `${process.cwd()}/dist/packages-dist`),
      Observable.from(copy(`${process.cwd()}/README.md`, `${process.cwd()}/dist/packages-dist/README.md`)),
      Observable.from(copy(`${process.cwd()}/src/lib/package.json`, `${process.cwd()}/dist/packages-dist/package.json`)),
      Observable.from(copy(`${process.cwd()}/src/lib/toastr.css`, `${process.cwd()}/dist/packages-dist/toastr.css`)),
    );

}

function buildLibrary(globals) {
  const modules$ = buildModule(globals);
  return Observable
    .forkJoin(modules$)
    .switchMap(() => createBundles(globals))
    .switchMap(() => copyFiles())
    .do(() => verifyVersions());
}

buildLibrary(GLOBALS).subscribe(
  data => console.log('success'),
  err => console.log('err', err),
  () => console.log('complete'),
);
