import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import json from '../lib/package.json';


@Component({
  selector: 'app-root',
  template: `
  <app-header></app-header>
  <github-link></github-link>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
`,
})
export class AppComponent {
  constructor(title: Title) {
    // sync options to toastrservice
    // this sets the options in the demo
    const current = title.getTitle();
    // fix for tests
    if (json) {
      title.setTitle(`${current}: v${json.version}`);
    }
  }
}
