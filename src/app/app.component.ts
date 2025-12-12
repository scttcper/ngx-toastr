import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    ToastNoAnimationModule,
    GhButtonModule,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
