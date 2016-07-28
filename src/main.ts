import {bootstrap} from '@angular/platform-browser-dynamic';
import {DemoApp} from './demo-app/demo-app';
import {Renderer} from '@angular/core';
import 'rxjs/Rx';

bootstrap(DemoApp, [
  Renderer,
]);
