import { Toast } from './toast.component';
import { GlobalConfig } from './toastr-config';

export class DefaultGlobalConfig implements GlobalConfig {
  // Global
  maxOpened = 0;
  autoDismiss = false;
  newestOnTop = true;
  preventDuplicates = false;
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };

  // Individual
  toastComponent = Toast;
  closeButton = false;
  disableTimeOut: false;
  timeOut = 5000;
  extendedTimeOut = 1000;
  enableHtml = false;
  progressBar = false;
  toastClass = 'toast';
  positionClass = 'toast-top-right';
  titleClass = 'toast-title';
  messageClass = 'toast-message';
  easing = 'ease-in';
  easeTime = 300;
  tapToDismiss = true;
  onActivateTick = false;
  progressAnimation: 'decreasing' | 'increasing' = 'decreasing';
}
