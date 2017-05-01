import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from '../lib';

import { AppComponent } from './app.component';
import { PinkToast } from './pink.toast';
import { NotyfToast } from './notyf.toast';
// import { ToastContainerModule } from '../lib/toast-directive';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
    NotyfToast,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    // ToastContainerModule.forRoot(),
  ],
  entryComponents: [
    PinkToast,
    NotyfToast,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
