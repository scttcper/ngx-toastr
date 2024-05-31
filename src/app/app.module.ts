import { NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { ToastNoAnimationModule, ToastContainerDirective } from '../lib/public_api';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotyfToast } from './notyf.toast';
import { PinkToast } from './pink.toast';
import { BootstrapToast } from './bootstrap.toast';
import { provideToastr } from '../lib/toastr/toast.provider';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
    BootstrapToast,
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
    ToastContainerDirective,
    GhButtonModule,
  ],
  providers: [provideToastr(), provideExperimentalZonelessChangeDetection()],
  bootstrap: [AppComponent],
})
export class AppModule {}
