import { Component } from '@angular/core';
import { Toast } from 'ngx-toastr';

@Component({
  selector: 'notyf-toast-component',
  templateUrl: './notyf-toast.component.html',
  styleUrl: './notyf-toast.component.scss',
  host: {
    'animate.enter': 'animate-notyf-in',
    'animate.leave': 'animate-notyf-out',
  },
})
export class NotyfToast extends Toast {}
