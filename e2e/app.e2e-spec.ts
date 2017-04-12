import { ToastrPage } from './app.po';

describe('toastr App', () => {
  let page: ToastrPage;

  beforeEach(() => {
    page = new ToastrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    page.clickShowToast();
    page.waitForToast().then(() => {
      expect<any>(page.getToast()).toEqual('app works!');
    });
  });
});
