import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ToastrModule, ToastConfig } from '../lib/toastr';
import { PinkToast } from './pink.toast';

// const toastConfig: ToastConfig = {
//   timeOut: 10000
// }

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [PinkToast],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
