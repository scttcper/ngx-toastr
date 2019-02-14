import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import {
  ToastrModule,
  ToastContainerModule,
  ToastNoAnimationModule,
} from '../lib/public_api';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotyfToast } from './notyf.toast';
import { PinkToast } from './pink.toast';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
    NotyfToast,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastNoAnimationModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    MdoButtonModule,
  ],
  entryComponents: [PinkToast, NotyfToast],
  bootstrap: [AppComponent],
})
export class AppModule {}
