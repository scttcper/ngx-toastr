import { Component, VERSION, ChangeDetectionStrategy, inject, viewChildren } from '@angular/core';
import { GlobalConfig, ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ToastManagerService } from '../toast-manager.service';

const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class HomeComponent {
  protected toastr = inject(ToastrService);
  protected toastManager = inject(ToastManagerService);

  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  enableBootstrap = false;
  inline = false;
  inlinePositionIndex = 0;
  inlineContainers = viewChildren(ToastContainerDirective);

  constructor() {
    this.options = this.toastr.toastrConfig;
  }

  fixNumber<K extends keyof GlobalConfig>(field: K): void {
    this.options[field] = Number(this.options[field]) as never;
  }

  setInlineClass(enableInline: boolean) {
    if (enableInline) {
      this.toastr.overlayContainer = this.inlineContainers()[this.inlinePositionIndex];
      this.options.positionClass = 'inline';
    } else {
      this.toastr.overlayContainer = undefined;
      this.options.positionClass = 'toast-top-right';
    }
  }

  setInlinePosition(index: number) {
    this.toastr.overlayContainer = this.inlineContainers()[index];
  }
}
