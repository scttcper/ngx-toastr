import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';
import { ToastNoAnimationModule } from '../lib/public_api';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-home></app-home>
    <app-footer></app-footer>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ToastNoAnimationModule,
    GhButtonModule,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
  ],
})
export class AppComponent {}
