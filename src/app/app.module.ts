import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ToastrModule } from '../lib/toastr';
import { PinkToast } from './pink.toast';
import { ToastContainerModule } from '../lib/overlay/overlay-directives';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ToastrModule.forRoot(),
    ToastContainerModule.forRoot(),
  ],
  entryComponents: [PinkToast],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
