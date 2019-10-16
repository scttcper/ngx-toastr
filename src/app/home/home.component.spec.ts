/* tslint:disable:no-use-before-declare */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Toast } from '../../lib/public_api';
import { ActiveToast, ToastrModule } from '../../lib/public_api';
import { NotyfToast } from '../notyf.toast';
import { PinkToast } from '../pink.toast';
import { HomeComponent } from './home.component';
import { DomSanitizer } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';

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
      declarations: [HomeComponent],
    }).compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should trigger onShown', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened).toBeDefined();
    opened.onShown.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.portal).toBeDefined();
    opened.onHidden.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onTap', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.portal).toBeDefined();
    opened.onTap.toPromise().then(() => {
      done();
    });
    opened.portal.instance.tapToast();
  });
  it('should extend life on mouseover and exit', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options.timeOut).toBe(1000);
    done();
  });
  it('should keep on mouse exit with extended timeout 0', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    app.options.extendedTimeOut = 0;
    const opened: ActiveToast<Toast> = app.openToast();
    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options.timeOut).toBe(0);
    done();
  });
  it('should trigger onShown for openPinkToast', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<PinkToast> = app.openPinkToast();
    expect(opened.portal).toBeDefined();
    opened.onShown.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden for openPinkToast', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<PinkToast> = app.openPinkToast();
    expect(opened.portal).toBeDefined();
    opened.onHidden.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onShown for openNotyf', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<NotyfToast> = app.openNotyf();
    expect(opened.portal).toBeDefined();
    opened.onShown.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden for openNotyf', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<NotyfToast> = app.openNotyf();
    expect(opened.portal).toBeDefined();
    opened.onHidden.toPromise().then(() => {
      done();
    });
  });
  it('should have defined componentInstance', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.toastRef.componentInstance).toBeDefined();
  }));
  it('should sanitize HTML', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app: HomeComponent = fixture.debugElement.componentInstance;
    const toastClass = 'ngx-toastr-should-sanitize-html';
    app.options.toastClass = toastClass;
    app.message = '<a href="#" onclick="return false">Click</a>';
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened).toBeDefined();
    opened.onShown.pipe(
      delay(100),
    ).toPromise().then(() => {
      const element = document.querySelector(`.${toastClass}`);
      expect(element.innerHTML).toContain('<a ');
      // Removed by [innerHTML]="message"
      expect(element.innerHTML).not.toContain('onclick');
      done();
    });
  });
  it('should pass through SafeHtml', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const sanitizer = TestBed.get(DomSanitizer);
    const app: HomeComponent = fixture.debugElement.componentInstance;
    const toastClass = 'ngx-toastr-should-pass-through-safe-html';
    app.options.toastClass = toastClass;
    // Non-empty title is required to pass the
    // !this.title.length && !this.message.length test which the SafeHtml message
    // will fail.
    app.title = 'Title';
    app.message = sanitizer.bypassSecurityTrustHtml('<a href="#" onclick="return false">Click</a>') as string;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened).toBeDefined();
    opened.onShown.pipe(
      delay(100),
    ).toPromise().then(() => {
      const element = document.querySelector(`.${toastClass}`);
      expect(element.innerHTML).toContain('<a ');
      // Not removed by [innerHTML]="message" since value is trusted
      expect(element.innerHTML).toContain('onclick');
      done();
    });
  });
});

@NgModule({
  imports: [CommonModule, ToastrModule],
  entryComponents: [PinkToast, NotyfToast],
  declarations: [PinkToast, NotyfToast],
})
class AppTestModule {}
