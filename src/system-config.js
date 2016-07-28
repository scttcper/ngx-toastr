var components = [
    'toastr',
];
var map = {
    '@angular2-material/core': 'core',
};
components.forEach(function (name) { return map[("@angular2-material/" + name)] = "components/" + name; });
var packages = {
    '@angular2-material/core': {
        format: 'cjs',
        defaultExtension: 'js'
    },
    '.': {
        defaultExtension: 'js'
    }
};
components.forEach(function (name) {
    packages[("@angular2-material/" + name)] = {
        format: 'cjs',
        defaultExtension: 'js'
    };
});
var barrels = [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/http',
    '@angular/forms',
    '@angular/router',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    'rxjs',
    'demo-app',
    'button-toggle',
    'gestures',
    'live-announcer',
    'portal',
    'overlay'
].concat(components);
var _cliSystemConfig = {};
barrels.forEach(function (barrelName) {
    _cliSystemConfig[barrelName] = { main: 'index' };
});
System.config({
    map: {
        '@angular': 'vendor/@angular',
        'rxjs': 'vendor/rxjs',
        'main': 'main.js'
    },
    packages: _cliSystemConfig
});
System.config({ map: map, packages: packages });
