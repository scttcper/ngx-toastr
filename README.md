# toastr-ng2
Angular 2 toastr with toast creation based on [@angular2-material/core](https://github.com/angular/material2) overlay. The main difference between toastr-ng2 and other available angular 2 toastr ports is that it does not use `*ngFor` to display new toasts allowing for more customization and higher performance.  

Inspired by [angular-toastr](https://github.com/Foxandxss/angular-toastr) and [toastr](https://github.com/CodeSeven/toastr).

## simple setup
### install  
```bash
npm i toastr-ng2 -s
```  
### setup  
__step 1:__ copy [toast css](https://github.com/scttcper/toastr-ng2/blob/master/src/demo-app/demo-app.scss) to your project. You can also import the css file from the npm module. It is not included with the toast component so it can be more easily overwritten. Is this a good choice? You decide.

__step 2:__ add ToastrModule to your @NgModule imports
```javascript
import { ToastrModule } from 'toastr-ng2';

@NgModule({
  bootstrap: [App],
  declarations: [App],
  // Import Toastr!
  imports: [ ToastrModule ]
})
class ExampleMainModule {}
```  

__step 3:__ pass viewContainerRef to ToastrService. This is a hack needed currently as the viewContainerRef is not available to services, but I've heard it will be eventually.  
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
    toastrService.viewContainerRef = this.viewContainerRef;
  }
}
```

__step 4:__ show simple toast
```javascript
this.toastrService.success('hello');
```

### Override default settings
add to bootstrap and remove TOASTR_PROVIDERS
```javascript
import { provide, Injector } from '@angular/core';
import { ToastrConfig, ToastrService, Overlay, OverlayContainer } from 'toastr-ng2';

@NgModule({
  bootstrap: [App],
  declarations: [App],
  // Import Toastr!
  imports: [ ToastrModule ],
  providers: [
    provide(ToastrService, {
      useFactory: (overlay: Overlay, injector: Injector) => {
        // override the config defaults here
        const customConfig = new ToastrConfig();
        // shorter timeOut
        customConfig.timeOut = 500;
        return new ToastrService(customConfig, overlay, injector);
      },
      deps: [Overlay, Injector],
    }),
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
