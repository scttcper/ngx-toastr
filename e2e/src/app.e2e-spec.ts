import { browser } from 'protractor';
import { ToastrPage } from './app.po';

describe('toastr App', () => {
  let page: ToastrPage;

  beforeEach(() => {
    page = new ToastrPage();
  });

  it('should display toast HELLO THERE', () => {
    page.navigateTo();
    page.enterMessage();
    page.clickShowToast();
    browser.waitForAngularEnabled(false);
    page.waitForToast().then((element) => {
      expect<any>(page.getToast().getText()).toEqual('HELLO THERE');
    });
  });

  it('should not block protractor while toast is visible', () => {
      browser.waitForAngularEnabled(true);
      page.navigateTo();
      page.enterMessage();
      page.clickShowToast();
      // No need to disable `waitForAngularEnabled´
      page.waitForToast().then((element) => {
          expect<any>(page.getToast().getText()).toEqual('HELLO THERE');
      });
      // Test does not run in a timeout
  });

  it('should auto close the toast within the timeout', () => {
      browser.waitForAngularEnabled(true);
      page.navigateTo();
      page.setTimeout(100);
      page.clickShowToast();
      page.waitForToast().then((element) => {
        page.waitForToastDisappear(400); // timeout + ease time
      });
    });
});
