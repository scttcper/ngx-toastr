/* tslint:disable:no-use-before-declare */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonService, MdoButtonModule } from '@ctrl/ngx-github-buttons';
import { of as ObservableOf } from 'rxjs';

import { ToastrModule } from '../lib/public_api';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

class FakeButtonService {
  repo(user: string, repo: string) {
    return ObservableOf({ stargazers_count: 0 });
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
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
        MdoButtonModule,
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        HomeComponent,
        HeaderComponent,
      ],
      providers: [{ provide: ButtonService, useClass: FakeButtonService }],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
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
