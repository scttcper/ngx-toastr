import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { PinkToast } from './pink.toast';
// import { ToastContainerModule } from '../lib/toast-directive';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ToastrModule.forRoot(),
    // ToastContainerModule.forRoot(),
  ],
  entryComponents: [PinkToast],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
