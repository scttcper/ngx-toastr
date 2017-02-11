# ngx-toastr 🍞 (formerly toastr-ng2)
> Renamed toastr-ng2 to ngx-toastr. Please point your package.json to the new name for continued updates.  

[![NPM version][npm-image]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage status][coverage-img]][coverage-url]
[![greenkeeper][greenkeeper-image]][greenkeeper-url]

[npm-image]: https://img.shields.io/npm/v/ngx-toastr.svg
[npm-url]: https://npmjs.org/package/ngx-toastr
[travis-img]: https://api.travis-ci.org/scttcper/ngx-toastr.svg?branch=master
[travis-url]: https://travis-ci.org/scttcper/ngx-toastr
[coverage-img]: https://codecov.io/gh/scttcper/ngx-toastr/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/scttcper/ngx-toastr
[greenkeeper-image]: https://badges.greenkeeper.io/scttcper/ngx-toastr.svg
[greenkeeper-url]: https://greenkeeper.io/  


DEMO: https://scttcper.github.io/ngx-toastr/

## Features
- Toast Component Injection without being passed `ViewContainerRef`
- No use of `*ngFor`. Fewer dirty checks and higher performance.
- AoT compilation and lazy loading compatible
- Component inheritance for custom toasts
- SystemJS rollup bundle ✓
- Animations using angular 2's [Web Animations API](https://angular.io/docs/ts/latest/guide/animations.html) (pollyfill needed for older devices)
- Output toasts to a target directive

## Install  
```bash
npm install ngx-toastr --save
```  
## Setup  
__step 1:__ copy [toast css](https://github.com/scttcper/ngx-toastr/blob/master/src/app/app.component.css) to your project.
If you are using sass you can import the css.
```scss
@import 'node_modules/ngx-toastr/toastr';
```
If you are using angular-cli you can add it to your angular-cli.json
```
"styles": [
  "styles.scss",
  "node_modules/ngx-toastr/toastr.css"
]
```

__step 2:__ add ToastrModule to app NgModule
```typescript
import { ToastrModule } from 'ngx-toastr';
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
import { ToastrService } from 'ngx-toastr';
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
There's global options and individual toast options. All individual toast options are included in the global options. See file `toastr-config.ts` The toastComponent can be inherited and modified. See the pink toast in the demo. It has a different animation and inline style.

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
enableHtml: boolean = false; // allow html in message. (UNSAFE)
extendedTimeOut: number = 1000; // time to close after a user hovers over toast
progressBar: boolean = false; // show progress bar
toastClass: string = 'toast'; // class on toast
positionClass: string = 'toast-top-right'; // class on toast
titleClass: string = 'toast-title'; // class inside toast on title
messageClass: string = 'toast-message'; // class inside toast on message
tapToDismiss: boolean = true; // close on click
onActivateTick: boolean = false; // fire a ApplicationRef.tick() from the toast component when activated. Might help show the toast if you are firing it from a websocket
```

### Override default settings
NEW FOR VERSION > 3
Option 1: Pass values to ToastrModule.forRoot
```typescript
// your NgModule
imports: [
  ToastrModule.forRoot({timeOut: 0}),
], 
```

Option 2: Inject ToastrConfig, typically in your root component, and customize the values.
```typescript
import { ToastrConfig } from 'ngx-toastr';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(toastrConfig: ToastrConfig) {
    toastrConfig.timeOut = 100;
  }
}
```

### individual toast settings
success, error, info, warning take ```(message, title, ToastConfig)``` pass a ToastConfig object to replace several default settings.
```typescript
// OPTIONAL: import the ToastConfig interface
import { ToastConfig } from 'ngx-toastr';

const errorConfig: ToastConfig = {timeOut: 10000};
this.toastrService.error('everything is broken', 'title is optional', errorConfig);
```

### Toastr Service methods return:
```typescript
export interface ActiveToast {
  toastId: number; // Your Toast ID. Use this to close it individually
  message: string; // the message of your toast. Stored for prevent duplicate reasons
  portal?: any; // a reference to the component see portal.ts
  toastRef?: ToastRef<any>;  // a reference to your toast
  onShown?: Observable<any>; // triggered when toast is active
  onHidden?: Observable<any>; // triggered when toast is destroyed
  onTap?: Observable<any>; // triggered on click
}
```
Toastr Service will return undefined if prevent duplicates is on.

### Put toasts in your own container
Put toasts in a specific div inside your application. This should probably be somewhere that doesn't get deleted.
Add `ToastContainerModule.forRoot()` to ngModule after the `ToastrModule.forRoot()`
Add a div with `toastContainer` directive on it.
```
import { ToastContainerDirective } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  template: `<div toastContainer class="toast-top-right"></div>`,
})
export class AppComponent implements OnInit {

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(private toastrService: ToastrService) {}
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.toastrService.success('in div');
  }
}
```

### SystemJS
If you are using SystemJS, you should also adjust your configuration to point to the UMD bundle.

In your systemjs config file, `map` needs to tell the System loader where to look for `ngx-toastr`:
```js
map: {
  'ngx-toastr': 'node_modules/ngx-toastr/toastr.umd.js',
}
```

## Previous Works
[angular-toastr](https://github.com/Foxandxss/angular-toastr) and the original [toastr](https://github.com/CodeSeven/toastr).

## License
MIT
