import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [provideBrowserGlobalErrorListeners(), provideToastr()],
}).catch(err => console.error(err));
