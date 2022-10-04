import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer mt-5">
   <div style="background-color:#1162D8;color:white;"> Angular {{ version }}
    <br>
    <a style="color:white;" href="https://github.com/scttcper/ngx-toastr/blob/master/LICENSE">MIT license</a>
    -
    <a style="color:white;" href="https://github.com/scttcper/ngx-toastr">Source</a>
   </div>
  </footer>
  `,
  styles: [
    `
      .footer {
        line-height: 2;
        text-align: center;
        font-size: 15px;
        font-family: var(--font-family-monospace);
        color: #999;
      }
    `,
  ],
})
export class FooterComponent {
  version = VERSION.full;
}
