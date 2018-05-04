import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule, ToastNoAnimationModule } from '../lib/public_api';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { GithubLinkComponent } from './github-link/github-link.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotyfToast } from './notyf.toast';
import { PinkToast } from './pink.toast';
// import { ToastContainerModule } from '../lib/toast.directive';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
    NotyfToast,
    FooterComponent,
    HeaderComponent,
    GithubLinkComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastNoAnimationModule,
    ToastrModule.forRoot(),
    // ToastContainerModule.forRoot(),
  ],
  entryComponents: [PinkToast, NotyfToast],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
