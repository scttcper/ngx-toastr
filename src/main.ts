import {bootstrap} from '@angular/platform-browser-dynamic';
import {DemoApp} from './demo-app/demo-app';
import {Renderer, provide, OpaqueToken, Component} from '@angular/core';
import 'rxjs/Rx';
import { OVERLAY_CONTAINER_TOKEN } from '@angular2-material/core';

export function createOverlayContainer(): Element {
  let container = document.createElement('div');
  container.classList.add('md-overlay-container');
  document.body.appendChild(container);
  return container;
}

bootstrap(DemoApp, [
  Renderer,
  provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()}),
]);
