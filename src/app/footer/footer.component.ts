import { Component, OnInit, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer">
    Demo using Anuglar {{version}}
    <br>
    Released under the
    <a href="https://github.com/scttcper/ngx-toastr/blob/master/LICENSE">MIT</a> license.
    <a href="https://github.com/scttcper/ngx-toastr">View source</a>.
  </footer>
  `,
  styles: [`
  .footer {
    margin-top: 3rem;
    line-height: 2;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
  @media only screen and (max-width: 480px) {
    .footer {
      font-size: 10px;
    }
  }
  `],
})
export class FooterComponent implements OnInit {
  version = VERSION.full;
  constructor() { }

  ngOnInit() {
  }

}
