import { bootstrap } from '@angular/platform-browser-dynamic';
import { DemoApp } from './demo-app/demo-app';
import { Renderer, provide, Injector, Provider } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import 'rxjs/Rx';

import { TOASTR_PROVIDERS, ToastrConfig, ToastrService } from './components/toastr/toastr';
import { Overlay } from './components/toastr/overlay/overlay';
import { OverlayContainer } from './components/toastr/overlay/overlay-container';


bootstrap(DemoApp, [
  disableDeprecatedForms(),
  provideForms(),
  Renderer,
  TOASTR_PROVIDERS
  // OverlayContainer,
  // Overlay,
  // provide(ToastrService, {
  //   useFactory: (overlay: Overlay, injector: Injector) => {
  //     const customConfig = new ToastrConfig();
  //     customConfig.timeOut = 500;
  //     return new ToastrService(customConfig, overlay, injector);
  //   },
  //   deps: [Overlay, Injector],
  // }),
]);
