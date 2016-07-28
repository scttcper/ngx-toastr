"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var demo_app_1 = require('./demo-app/demo-app');
var core_1 = require('@angular/core');
require('rxjs/Rx');
platform_browser_dynamic_1.bootstrap(demo_app_1.DemoApp, [
    core_1.Renderer,
]);
