import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer mb-4 mt-5">
    Angular {{ version }}
    <br>
    <a href="https://github.com/scttcper/ngx-toastr/blob/master/LICENSE">MIT license</a>
    -
    <a href="https://github.com/scttcper/ngx-toastr">Source</a>
    <br>
    Listed on <a href="https://angular.parts/package/ngx-toastr">angular.parts</a>
  </footer>
  `,
  styles: [
    `
      .footer {
        line-height: 2;
        text-align: center;
        font-size: 11px;
        font-family: var(--font-family-monospace);
        color: #999;
      }
    `,
  ],
})
export class FooterComponent {
  version = VERSION.full;
}
