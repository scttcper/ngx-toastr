# toastr-ng2
Angular 2 toastr with toast creation based on [@angular2-material/core](https://github.com/angular/material2) overlay

## simple setup
### install
```npm i toastr-ng2 -s```  
copy [toast css](https://github.com/scttcper/toastr-ng2/blob/master/src/demo-app/demo-app.scss) to your project
### setup
add TOASTR_PROVIDERS to your bootstrap file
```javascript
import { TOASTR_PROVIDERS } from 'toastr-ng2';

bootstrap(DemoApp, [
  TOASTR_PROVIDERS,
])
```
pass viewContainerRef to ToastrService
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
show simple toast
```javascript
this.toastrService.success('hello');
```

### custom default setup
add to bootstrap and remove TOASTR_PROVIDERS
```javascript
import { provide, Injector } from '@angular/core';
import { ToastrConfig, ToastrService, Overlay, OverlayContainer } from 'toastr-ng2';

bootstrap(DemoApp, [
  OverlayContainer,
  Overlay,
  provide(ToastrService, {
    useFactory: (overlay: Overlay, injector: Injector) => {
      const customConfig = new ToastrConfig();
      customConfig.timeOut = 500;
      return new ToastrService(customConfig, overlay, injector);
    },
    deps: [Overlay, Injector],
  }),
]);
```
