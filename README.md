<div align="center">
  <img src="https://raw.githubusercontent.com/scttcper/ngx-toastr/master/misc/documentation-assets/ngx-toastr-example.png" width="500" alt="Angular Toastr">
  <br>
  <h1>ngx-toastr</h1>
  <br>
  <a href="https://www.npmjs.org/package/ngx-toastr">
    <img src="https://badge.fury.io/js/ngx-toastr.svg" alt="npm">
  </a> 
  <a href="https://travis-ci.org/scttcper/ngx-toastr">
    <img src="https://travis-ci.org/scttcper/ngx-toastr.svg?branch=master" alt="travis"></a> 
  <a href="https://codecov.io/github/scttcper/ngx-toastr">
    <img src="https://img.shields.io/codecov/c/github/scttcper/ngx-toastr.svg" alt="codecov">
  </a>
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/scttcper/ngx-toastr.svg" alt="greenkeeper">
  </a>
  <br>
  DEMO: https://scttcper.github.io/ngx-toastr/
</div>
<br>
<br>

## Features
- Toast Component Injection without being passed `ViewContainerRef`
- No use of `*ngFor`. Fewer dirty checks and higher performance.
- AoT compilation and lazy loading compatible
- Component inheritance for custom toasts
- SystemJS/UMD rollup bundle
- Animations using Angular's [Web Animations API](https://angular.io/docs/ts/latest/guide/animations.html) (polyfill needed for older devices)
- Output toasts to an optional target directive

## Install
```bash
npm install ngx-toastr --save
```  
`@angular/animations` package is a required dependency for the default toast
```bash
npm install @angular/animations --save
```

## Setup  
__step 1:__ add css 
- copy [toast css](https://github.com/scttcper/ngx-toastr/blob/master/src/app/app.component.css) to your project.
- If you are using sass you can import the css.
```scss
@import "~ngx-toastr/toastr";
```
- If you are using angular-cli you can add it to your angular-cli.json
```json
"styles": [
  "styles.scss",
  "../node_modules/ngx-toastr/toastr.css"
]
```

__step 2:__ add ToastrModule to app NgModule
```typescript
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule, // required animations module
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
  constructor(private toastr: ToastrService) {}
  
  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
```

## Options
There are __individual options__ and __global options__.

### Individual Options  
Passed to `ToastrService.success/error/warn/info/show()`

|     Option        |   Type    |      Default      |                                    Description                                     |
| ----------------- | --------- | ----------------- | ---------------------------------------------------------------------------------- |
| toastComponent    | Component | Toast             | Angular component that will be used                                                |
| closeButton       | boolean   | false             | Show close button                                                                  |
| timeOut           | number    | 5000              | Time to live in milliseconds                                                       |
| extendedTimeOut   | number    | 1000              | Time to close after a user hovers over toast                                       |
| enableHtml        | boolean   | false             | Allow html in message                                                              |
| progressBar       | boolean   | false             | Show progress bar                                                                  |
| progressAnimation | 'decreasing' &#124; 'increasing'  | 'decreasing'      | Changes the animation of the progress bar. |
| toastClass        | string    | 'toast'           | Class on toast                                                                     |
| positionClass     | string    | 'toast-top-right' | Class on toast container                                                           |
| titleClass        | string    | 'toast-title'     | Class inside toast on title                                                        |
| messageClass      | string    | 'toast-message'   | Class inside toast on message                                                      |
| tapToDismiss      | boolean   | true              | Close on click                                                                     |
| onActivateTick    | boolean   | false             | Fires `ApplicationRef.tick()` when activated. Helps show toast from asynchronous events outside of Angular's change detection |


#### Setting Individual Options
success, error, info, warning take ```(message, title, ToastConfig)``` pass an options object to replace any default option.
```typescript
this.toastrService.error('everything is broken', 'title is optional', { timeOut: 3000 });
```

### Global Options  
All [individual options](#individual-options) can be overridden in the global options to affect all toasts. In addition, global options include the following options:

|      Option       |  Type   |              Default               |                       Description                        |
| ----------------- | ------- | ---------------------------------- | -------------------------------------------------------- |
| maxOpened         | number  | 0                                  | Max toasts opened. Toasts will be queued. 0 is unlimited |
| autoDismiss       | boolean | false                              | Dismiss current toast when max is reached                |
| iconClasses       | object  | [see below](#iconclasses-defaults) | Classes used on toastr service methods                   |
| newestOnTop       | boolean | true                               | New toast placement                                      |
| preventDuplicates | boolean | false                              | Block duplicate messages                                 |

##### iconClasses defaults
```typescript
iconClasses = {
  error: 'toast-error',
  info: 'toast-info',
  success: 'toast-success',
  warning: 'toast-warning',
};
```

#### Setting Global Options
Pass values to `ToastrModule.forRoot()`  
```typescript
// root app NgModule
imports: [
  ToastrModule.forRoot({ 
    timeOut: 10000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
  }),
], 
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
  onAction?: Observable<any>; // available for your use in custom toast
}
```
Toastr Service will return undefined if prevent duplicates is on.

### Put toasts in your own container
Put toasts in a specific div inside your application. This should probably be somewhere that doesn't get deleted.
Add `ToastContainerModule` to the ngModule where you need the directive available.
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    ToastrModule.forRoot({positionClass: 'inline'}),
    ToastContainerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
Add a div with `toastContainer` directive on it.
```typescript
import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  template: `
  <h1><a (click)="onClick()">Click</a></h1>
  <div toastContainer></div>
`,
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(private toastrService: ToastrService) {}
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }
  onClick() {
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
  
### FAQ  
1. ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked  
When opening a toast inside an angular lifecycle wrap it in setTimeout  
```typescript
ngOnInit() {
    setTimeout(() => this.toastr.success('sup'))
}
```
2. Change default icons (check, warning sign, etc)  
Overwrite the css background-image
https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css  
3. How do I use this in an ErrorHandler?
See: https://github.com/scttcper/ngx-toastr/issues/179
4. How can I translate messages
See: https://github.com/scttcper/ngx-toastr/issues/201

## Previous Works
[toastr](https://github.com/CodeSeven/toastr) original toastr  
[angular-toastr](https://github.com/Foxandxss/angular-toastr) AngularJS toastr  
[notyf](https://github.com/caroso1222/notyf) notyf (css)

## License
MIT
