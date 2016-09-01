import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import 'rxjs/Rx';
import 'lodash';

import { DemoApp } from './demo-app/demo-app';
import { ToastrModule, provideToastr } from './components/toastr/toastr';

@NgModule({
  bootstrap: [ DemoApp ],
  declarations: [ DemoApp ],
  imports: [
    BrowserModule,
    FormsModule,
    ToastrModule,
  ],
  providers: [
    // for testing a custom setup
    // provideToastr({
    //   timeOut: 500,
    // })
  ],
})
class MainModule {}

platformBrowserDynamic().bootstrapModule(MainModule);
