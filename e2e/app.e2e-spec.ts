import { browser } from 'protractor';
import { ToastrPage } from './app.po';

describe('toastr App', () => {
  let page: ToastrPage;

  beforeEach(() => {
    page = new ToastrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    page.enterMessage();
    page.clickShowToast();
    browser.waitForAngularEnabled(false);
    page.waitForToast().then((element) => {
      expect<any>(page.getToast().getText()).toEqual('HELLO THERE');
    });
  });
});
