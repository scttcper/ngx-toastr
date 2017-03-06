import { ToastrPage } from './app.po';

describe('toastr App', () => {
  let page: ToastrPage;

  beforeEach(() => {
    page = new ToastrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
