import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import 'rxjs/Rx';
import 'lodash';

import { DemoApp } from './demo-app/demo-app';
import { ToastrModule } from './components/toastr/toastr';

@NgModule({
  bootstrap: [
    DemoApp
  ],
  declarations: [
    DemoApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ToastrModule,
  ],
})
class MainModule {}


// for testing a custom setup
// import { NgModule, provide, Injector } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { FormsModule } from '@angular/forms';
// import 'rxjs/Rx';
// import 'lodash';
//
// import { DemoApp } from './demo-app/demo-app';
// import { ToastrModule, Overlay, ToastrConfig, ToastrService } from './components/toastr/toastr';
//
// @NgModule({
//   bootstrap: [
//     DemoApp
//   ],
//   declarations: [
//     DemoApp
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     ToastrModule
//   ],
//   providers: [
//     provide(ToastrService, {
//       useFactory: (overlay: Overlay, injector: Injector) => {
//         const customConfig = new ToastrConfig();
//         customConfig.timeOut = 500;
//         return new ToastrService(customConfig, overlay, injector);
//       },
//       deps: [Overlay, Injector],
//     }),
//   ]
// })
// class MainModule {}

platformBrowserDynamic().bootstrapModule(MainModule);
