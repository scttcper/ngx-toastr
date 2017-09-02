import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from '../lib/public_api';

import { AppComponent } from './app.component';
import { PinkToast } from './pink.toast';
import { NotyfToast } from './notyf.toast';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { GithubLinkComponent } from './github-link/github-link.component';
// import { ToastContainerModule } from '../lib/toast-directive';

@NgModule({
  declarations: [
    AppComponent,
    PinkToast,
    NotyfToast,
    FooterComponent,
    HeaderComponent,
    GithubLinkComponent,
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
