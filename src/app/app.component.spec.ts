/* tslint:disable:no-use-before-declare */
import { TestBed, async } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { ToastrModule, ActiveToast } from '../lib/public_api';

import { AppComponent } from './app.component';
import { PinkToast } from './pink.toast';
import { NotyfToast } from './notyf.toast';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { GithubLinkComponent } from './github-link/github-link.component';

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
    }).compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should trigger onShown', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openToast();
    expect(opened).toBeDefined();
    opened.onShown!.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openToast();
    expect(opened.portal).toBeDefined();
    opened.onHidden!.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onTap', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openToast();
    expect(opened.portal).toBeDefined();
    opened.onTap!.toPromise()
      .then(() => {
        done();
      });
      opened.portal!.instance.tapToast();
  });
  it('should extend life on mouseover and exit', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openToast();
    opened.portal!.instance.stickAround();
    opened.portal!.instance.delayedHideToast();
    expect(opened.portal!.instance.options.timeOut).toBe(1000);
    done();
  });
  it('should keep on mouse exit with extended timeout 0', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.options.extendedTimeOut = 0;
    const opened: ActiveToast = app.openToast();
    opened.portal!.instance.stickAround();
    opened.portal!.instance.delayedHideToast();
    expect(opened.portal!.instance.options.timeOut).toBe(0);
    done();
  });
  it('should trigger onShown for openPinkToast', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openPinkToast();
    opened.onShown!.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden for openPinkToast', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openPinkToast();
    opened.onHidden!.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onShown for openNotyf', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openNotyf();
    opened.onShown!.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden for openNotyf', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast = app.openNotyf();
    opened.onHidden!.toPromise().then(() => {
      done();
    });
  });
});

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
  ],
  entryComponents: [PinkToast, NotyfToast],
  declarations: [PinkToast, NotyfToast],
})
class AppTestModule { }
