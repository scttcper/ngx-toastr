import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
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
    CommonModule,
    BrowserModule,
    FormsModule,
    ToastrModule,
  ],
})
class MainModule {}


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
platformBrowserDynamic().bootstrapModule(MainModule);
