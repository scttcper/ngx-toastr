import { bootstrap } from '@angular/platform-browser-dynamic';
import { DemoApp } from './demo-app/demo-app';
import { provide, Injector } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import 'rxjs/Rx';
import 'lodash';

import { TOASTR_PROVIDERS, ToastrConfig, ToastrService } from './components/toastr/toastr';
import { Overlay } from './components/toastr/overlay/overlay';
import { OverlayContainer } from './components/toastr/overlay/overlay-container';


bootstrap(DemoApp, [
  disableDeprecatedForms(),
  provideForms(),
  TOASTR_PROVIDERS,
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
