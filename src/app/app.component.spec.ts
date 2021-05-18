/* eslint-disable @typescript-eslint/no-use-before-define */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { ToastrModule } from '../lib/public_api';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          timeOut: 800,
          progressBar: true,
          onActivateTick: true,
          enableHtml: true,
        }),
        FormsModule,
        BrowserAnimationsModule,
        AppTestModule,
        GhButtonModule,
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        HomeComponent,
        HeaderComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

@NgModule({
  imports: [CommonModule, ToastrModule],
  entryComponents: [],
  declarations: [],
})
class AppTestModule {}
