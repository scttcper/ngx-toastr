import { NgxToastrPage } from './app.po';

describe('ngx-toastr App', function() {
  let page: NgxToastrPage;

  beforeEach(() => {
    page = new NgxToastrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
