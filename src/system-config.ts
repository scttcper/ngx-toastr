/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/

const components = [
  'toastr',
];

/** Map relative paths to URLs. */
const map: any = {
};


/** User packages configuration. */
const packages: any = {
  // Set the default extension for the root package, because otherwise the demo-app can't
  // be built within the production mode. Due to missing file extensions.
  '.': {
    defaultExtension: 'js'
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/forms',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular2-material/core',
  '@types/core-js',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'demo-app',
  'button-toggle',
  'gestures',
  'live-announcer',
  'portal',
  'overlay',
  ...components
  /** @cli-barrel */
];

const _cliSystemConfig = {};
barrels.forEach((barrelName: string) => {
  (<any> _cliSystemConfig)[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    '@angular2-material': 'vendor/@angular2-material',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: _cliSystemConfig
});

const materialPkgs:string[] = [
  'core',
];

materialPkgs.forEach((pkg) => {
  packages[`@angular2-material/${pkg}`] = {main: `${pkg}.js`};
});

// Apply the user's configuration.
System.config({ map, packages });
