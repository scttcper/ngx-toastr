import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Toast, ActiveToast, ToastrModule } from 'ngx-toastr';
import { NotyfToast } from '../notyf-toast/notyf-toast.component';
import { PinkToast } from '../pink-toast/pink-toast.component';
import { HomeComponent } from './home.component';
import { firstValueFrom } from 'rxjs';

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
        HomeComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should trigger onShown', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened).toBeDefined();
    firstValueFrom(opened.onShown).then(() => {
      done();
    });
  });
  it('should trigger onHidden', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onHidden).then(() => {
      done();
    });
  });
  it('should trigger onTap', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onTap).then(() => {
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
    expect(opened.portal.instance.options().timeOut).toBe(1000);
    done();
  });
  it('should keep on mouse exit with extended timeout 0', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    app.options.extendedTimeOut = 0;
    const opened: ActiveToast<Toast> = app.openToast();
    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(0);
    done();
  });
  it('should trigger onShown for openPinkToast', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<PinkToast> = app.openPinkToast();
    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onShown).then(() => {
      done();
    });
  });
  it('should trigger onHidden for openPinkToast', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<PinkToast> = app.openPinkToast();
    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onHidden).then(() => {
      done();
    });
  });
  it('should trigger onShown for openNotyf', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<NotyfToast> = app.openNotyf();
    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onShown).then(() => {
      done();
    });
  });
  it('should trigger onHidden for openNotyf', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<NotyfToast> = app.openNotyf();
    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onHidden).then(() => {
      done();
    });
  });
  it('should have defined componentInstance', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.toastRef.componentInstance).toBeDefined();
  });
});
