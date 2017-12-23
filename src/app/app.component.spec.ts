/* tslint:disable:no-use-before-declare */
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ToastrModule } from '../lib/public_api';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { GithubLinkComponent } from './github-link/github-link.component';
import { HeaderComponent } from './header/header.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          timeOut: 800,
          progressBar: true,
          onActivateTick: true,
          enableHtml: true,
        }),
        RouterModule.forRoot([{ path: '', component: FooterComponent, pathMatch: 'full'}]),
        FormsModule,
        BrowserAnimationsModule,
        AppTestModule,
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        GithubLinkComponent,
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue : '/' },
      ],
    }).compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
  ],
  entryComponents: [],
  declarations: [],
})
class AppTestModule { }
