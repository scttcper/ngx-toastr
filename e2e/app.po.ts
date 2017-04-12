import { browser, element, by, ProtractorBy } from 'protractor';

export class ToastrPage {
  navigateTo() {
    return browser.get('/');
  }

  waitForToast() {
    return browser.isElementPresent(by.id('message') as ProtractorBy);
  }
  getToast() {
    return element(by.id('message')).getText();
  }
  clickShowToast() {
    return element.all(by.css('button')).get(0).click();
  }
}
