import { ToastrNg2Page } from './app.po';

describe('ngx-toastr App', function() {
  let page: ToastrNg2Page;

  beforeEach(() => {
    page = new ToastrNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
