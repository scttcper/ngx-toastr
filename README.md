# toastr-ng2
[![npm](https://img.shields.io/npm/v/toastr-ng2.svg?maxAge=3600)](https://www.npmjs.com/package/toastr-ng2)

DEMO: https://scttcper.github.io/toastr-ng2/

Inspired by [angular-toastr](https://github.com/Foxandxss/angular-toastr) and the original [toastr](https://github.com/CodeSeven/toastr).

##### Why another toastr?
- Toast component injection based on [@angular2-material/core/overlay](https://github.com/angular/material2)
- No use of `*ngFor`. Fewer dirty checks and higher performance.
- Toast component can be overwritten for custom style or html.
- Animations using angular 2's [Web Animations API](https://angular.io/docs/ts/latest/guide/animations.html) (pollyfill needed for older devices)

## Install  
```bash
npm install toastr-ng2 --save
```  
## Setup  
__step 1:__ copy [toast css](https://github.com/scttcper/toastr-ng2/blob/master/src/app/app.component.css) to your project.
If you are using sass you can import the css.
```sass
@import 'node_modules/toastr-ng2/toastr';
```

__step 2:__ add ToastrModule to app NgModule
```typescript
import { ToastrModule } from 'toastr-ng2';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot(), // ToastrModule added
  ], 
  bootstrap: [App],
  declarations: [App],
})
class MainModule {}
```  

## Use
Success:
```typescript
import { ToastrService } from 'toastr-ng2';
@Component({
  ...
})
export class YourComponent {
  constructor(private toastrService: ToastrService) {}
  
  showSuccess() {
    this.toastrService.success('Hello world!', 'Toastr fun!');
  }
}
```
![success](http://i.imgur.com/ZTVc9vg.png)  


## Options
There's global options and individual toast options. All individual toast options are included in the global options. See file `toastr-config.ts` The toastComponent can be overridden with your own angular 2 component. See the custom pink toast in the demo.

### ToastrConfig (Global Options)
```typescript
maxOpened: number = 0; // max toasts opened. Toasts will be queued
autoDismiss: boolean = false; // dismiss current toast when max is reached
iconClasses = { // classes used on toastr service methods
  error: 'toast-error',
  info: 'toast-info',
  success: 'toast-success',
  warning: 'toast-warning',
};
newestOnTop: boolean = true; // new toast placement
preventDuplicates: boolean = false; // block duplicate messages
```

### ToastConfig (Individual Toast options)
```typescript
toastComponent = Toast; // the angular 2 component that will be used
closeButton: boolean = false; // show close button
timeOut: number = 5000; // time to live
extendedTimeOut: number = 1000; // time to close after a user hovers over toast
onHidden: EventEmitter<any> = new EventEmitter(); // fired on event
onShown: EventEmitter<any> = new EventEmitter(); // fired on event
onTap: EventEmitter<any> = new EventEmitter(); // fired on event
progressBar: boolean = false; // show progress bar
toastClass: string = 'toast'; // class on toast
positionClass: string = 'toast-top-right'; // class on toast
titleClass: string = 'toast-title'; // class inside toast on title
messageClass: string = 'toast-message'; // class inside toast on message
tapToDismiss: boolean = true; // close on click
```

### Override default settings
NEW FOR VERSION > 3 global overrides must be done inside a component.
Inject ToastrConfig, typically in your root component, and customize the values of its properties in order to provide default values for all the timepickers used in the application.
```javascript
import { ToastrConfig } from 'toastr-ng2';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(config: ToastrConfig) {
    config.timeOut = 100;
  }
}
```

### individual toast settings
success, error, info, warning take ```(message, title, ToastConfig)``` pass a ToastConfig object to replace several default settings.
```javascript
import { ToastConfig } from 'toastr-ng2';

let errorConfig = new ToastConfig();
// display until dismissed
errorConfig.timeOut = 0;

// OR pass config as an object
errorConfig = new ToastConfig({timeOut: 10000});

this.toastrService.error('everything is broken', 'title is optional', errorConfig);
```

### Toastr Service methods return:
```typescript
export interface ActiveToast {
  toastId: number; // Your Toast ID. Use this to close it individually
  message: string; // the message of your toast. Stored for prevent duplicate reasons
  portal?: any; // a reference to the component see portal.ts
  overlayRef?: OverlayRef; // a wrapper that attaches and detaches portals see overlay-ref.ts
}
```
Toastr Service will return undefined if prevent duplicates is on.
