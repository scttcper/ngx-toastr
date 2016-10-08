# toastr-ng2
[![npm](https://img.shields.io/npm/v/toastr-ng2.svg?maxAge=2592000)](https://www.npmjs.com/package/toastr-ng2)

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
__step 1:__ copy [toast css](https://github.com/scttcper/toastr-ng2/blob/master/src/app/app.component.css) to your project. You can also import the css file from the npm module. It is not included with the toast component so it can be more easily overwritten. Is this a good choice? You decide.

__step 2:__ add ToastrModule to app NgModule
```javascript
import { ToastrModule } from 'toastr-ng2';

@NgModule({
  imports: [ToastrModule],
  bootstrap: [App],
  declarations: [App],
})
class MainModule {}
```  
__step 3:__ pass viewContainerRef to ToastrService. This is needed currently as the viewContainerRef is not available to services, but should be soon.  
```javascript
import { ToastrService } from 'toastr-ng2';
import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'demo-app',
})
export class DemoApp {
  constructor(
    private toastrService: ToastrService,
    private viewContainerRef: ViewContainerRef
  ) {
    this.toastrService.viewContainerRef = this.viewContainerRef;
  }
}
```
## Use
Success:
```javascript
this.toastrService.success('Hello world!', 'Toastr fun!');
```
![success](http://i.imgur.com/ZTVc9vg.png)

### Override default settings
```javascript
import { NgModule } from '@angular/core';
import { ToastrModule, provideToastr } from 'toastr-ng2';

@NgModule({
  bootstrap: [App],
  declarations: [App],
  // Import Toastr!
  imports: [ ToastrModule ],
  providers: [
    // Override options here
    provideToastr({
      timeOut: 500,
    })
  ]
})
class ExampleMainModule {}
```


### individual toast settings
success, error, info, warning take ```(message, title, ToastConfig)``` pass a ToastConfig object to replace several default settings.
```javascript
import { ToastConfig } from 'toastr-ng2';

let errorConfig = new ToastConfig();
// display until dismissed
errorConfig.timeOut = 0;
this.toastrService.error('everything is broken', 'title is optional', errorConfig);
```
