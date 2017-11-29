import { browser, by, element, until } from 'protractor';

export class ToastrPage {
  navigateTo() {
    return browser.get('/');
  }
  enterMessage() {
    return browser
      .findElement(by.id('toastTitle'))
      .then((model) => {
        model.sendKeys('HELLO THERE');
      });
  }
  waitForToast() {
    return browser
      .wait(until.elementLocated(by.className('toast')), 500, 'not found')
      .then((el) => {
        return browser.wait(until.elementIsVisible(el), 5000, 'not found');
      });
  }
  getToast() {
    return browser.findElement(by.className('toast'));
  }
  clickShowToast() {
    return element.all(by.css('button')).get(0).click();
  }
}
