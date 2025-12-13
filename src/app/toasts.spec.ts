import { TestBed } from '@angular/core/testing';
import { Toast, ActiveToast, ToastrModule, type ToastNoAnimation, ToastrService } from 'ngx-toastr';
import { NotyfToast } from './notyf-toast/notyf-toast.component';
import { PinkToast } from './pink-toast/pink-toast.component';
import { firstValueFrom } from 'rxjs';
import type { BootstrapToast } from './bootstrap-toast/bootstrap-toast.component';
import { ToastManagerService } from './toast-manager.service';

describe('Toasts', () => {
  let toastManager!: ToastManagerService;
  let toastrService!: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          timeOut: 800,
          progressBar: true,
          onActivateTick: true,
          enableHtml: true,
        }),
      ],
      providers: [ToastManagerService, ToastrService],
    });

    toastManager = TestBed.inject(ToastManagerService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should trigger onShown', done => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened).toBeDefined();
    firstValueFrom(opened.onShown).then(() => {
      done();
    });
  });

  it('should trigger onHidden', done => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onHidden).then(() => {
      done();
    });
  });

  it('should trigger onTap', done => {
    const opened: ActiveToast<Toast> = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onTap).then(() => {
      done();
    });
    opened.portal.instance.tapToast();
  });

  it('should extend life on mouseover and exit', done => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(1000);
    done();
  });

  it('should keep on mouse exit with extended timeout 0', done => {
    toastrService.toastrConfig.extendedTimeOut = 0;
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(0);
    done();
  });

  it('should trigger onShown for openPinkToast', done => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onShown).then(() => {
      done();
    });
  });

  it('should trigger onAction for openPinkToast', done => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onAction).then(() => {
      done();
    });
    opened.portal.instance.action(new Event('click'));
  });

  it('should trigger onHidden for openPinkToast', done => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onHidden).then(() => {
      done();
    });
  });

  it('should trigger onShown for openNotyf', done => {
    const opened = toastManager.openNotyf() as ActiveToast<NotyfToast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onShown).then(() => {
      done();
    });
  });

  it('should trigger onHidden for openNotyf', done => {
    const opened = toastManager.openNotyf() as ActiveToast<NotyfToast>;

    expect(opened.portal).toBeDefined();
    firstValueFrom(opened.onHidden).then(() => {
      done();
    });
  });

  it('should have defined componentInstance', () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should have defined componentInstance BootstrapToast', () => {
    const opened = toastManager.openBootstrapToast() as ActiveToast<BootstrapToast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should have defined componentInstance ToastNoAnim', () => {
    const opened = toastManager.openToastNoAnimation() as ActiveToast<ToastNoAnimation>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should close all toasts', () => {
    jasmine.clock().install();

    toastManager.openToastNoAnimation();
    toastManager.openToastNoAnimation();
    toastManager.openToastNoAnimation();

    expect(toastrService.currentlyActive).toBe(3);

    toastManager.clearToasts();
    jasmine.clock().tick(1);
    expect(toastrService.currentlyActive).toBe(0);

    jasmine.clock().uninstall();
  });

  it('Should close last toast', done => {
    toastManager.openToastNoAnimation();
    const lastToast = toastManager.openToastNoAnimation();
    expect(toastrService.currentlyActive).toBe(2);

    firstValueFrom(lastToast!.onHidden).then(() => {
      done();
    });

    toastManager.clearLastToast();
  });
});
