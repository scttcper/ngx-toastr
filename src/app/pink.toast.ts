import {
  Component,
  trigger,
  state,
  transition,
  animate,
  style,
} from '@angular/core';

import { Toast } from '../lib/toastr';


@Component({
  selector: '[pink-toast-component]',
  styles: [`
    :host {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important;
      background-color: #fa39c3;
    }
  `],
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" class="toast-close-button">
    &times;
  </button>
  <div *ngIf="title" class="{{options.titleClass}}" [attr.aria-label]="title">
    {{title}}
  </div>
  <div *ngIf="message" class="{{options.messageClass}}" [attr.aria-label]="message">
    {{message}}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width.%]="width"></div>
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        transform: 'translateX(200%)'
      })),
      state('active', style({
        transform: 'translateX(0%)'
      })),
      state('removed', style({
        transform: 'translateX(200%)'
      })),
      transition('inactive <=> active', animate('150ms linear')),
      transition('active <=> removed', animate('150ms linear')),
    ]),
  ],
})
export class PinkToast extends Toast {

}
