import {browser, by, element, until, ExpectedConditions} from 'protractor';

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
  setTimeout(timeout) {
    return browser
        .findElement((by.id('toastTimeout')))
        .then(model => {
          model.clear();
          model.sendKeys(timeout);
        });
  }
  waitForToast() {
    return browser
      .wait(until.elementLocated(by.className('toast')), 500, 'not found')
      .then((el) => {
        return browser.wait(until.elementIsVisible(el), 5000, 'not found');
      });
  }
  waitForToastDisappear(timeout) {
    const toast = by.className('toast');
    return browser
       .wait(until.elementLocated(toast), 500, 'not found')
       .then((el) => {
          return browser.wait(ExpectedConditions.stalenessOf(element(toast)), timeout, 'still visible');
       });
  }
  getToast() {
    return browser.findElement(by.className('toast'));
  }
  clickShowToast() {
    return element.all(by.css('button')).get(0).click();
  }
}
