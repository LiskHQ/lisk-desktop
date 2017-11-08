import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import { createNewBrowserWindow, send, sendEventsFromEventStack, menuPopup, sendLanguage } from './utils';

describe('Electron Main', () => {
  describe('BrowserWindow', () => {
    const path = { resolve: () => ('test') };
    const BrowserWindow = ({ width, height, center, webPreferences }) =>
      ({ width, height, center, webPreferences });

    it('Creates the window and sets webPreferences', () => {
      const win = createNewBrowserWindow({ width: 2000, height: 1000, BrowserWindow, path });
      expect(win.webPreferences.backgroundThrottling).to.equal(false);
      expect(win.webPreferences.preload).to.equal('test');
      expect(win.center).to.equal(true);
    });

    it('Creates the window and knows how to adjust the size', () => {
      const win = createNewBrowserWindow({ width: 2000, height: 1000, BrowserWindow, path });
      expect(win.height).to.equal(850);
      expect(win.width).to.equal(1750);
    });

    it('Creates the window and knows how to adjust the size', () => {
      const win = createNewBrowserWindow({ width: 2001, height: 1001, BrowserWindow, path });
      expect(win.height).to.equal(700);
      expect(win.width).to.equal(1000);
    });
  });

  describe('Sending events', () => {
    let win;
    const callbacks = {};
    const storage = {
      get: (item, callback) => {
        callbacks[item] = callback;
      },
    };
    let eventStack;
    beforeEach(() => {
      const sendSpy = spy();
      const pushSpy = spy();
      win = {
        webContents: { send: sendSpy },
      };
      eventStack = { push: pushSpy };
    });

    it('Saves events in event stack', () => {
      send({ event: 'openUrl', value: 'someurl', win, eventStack });
      expect(win.webContents.send).to.not.have.been.calledWith();
      expect(eventStack.push).to.have.been.calledWith({ event: 'openUrl', value: 'someurl' });
    });

    it('Sends the events from the event stack', () => {
      const event = { event: 'someEvent', value: 'someValue' };
      eventStack = [event, event];
      sendEventsFromEventStack({ eventStack, win });

      expect(win.webContents.send).to.have.been.calledWith('someEvent', 'someValue').callCount(2);
    });

    it('Sends events', () => {
      win.isUILoaded = true;
      send({ event: 'openUrl', value: 'someurl', win, eventStack });
      expect(win.webContents.send).to.have.been.calledWith('openUrl', 'someurl');
      expect(eventStack.push).to.not.have.been.calledWith();
    });

    it.only('Sends the detected language', () => {
      win.isUILoaded = true;
      sendLanguage({ storage, win, eventStack });
      callbacks.config(null, { lang: 'de' });

      expect(win.webContents.send).to.have.been.calledWith('detectedLocale', 'de');
      expect(eventStack.push).to.not.have.been.calledWith();
    });
  });

  describe('Menu Popup', () => {
    const win = {};
    let selectionMenu;
    let inputMenu;

    beforeEach(() => {
      const selectionMenuSpy = spy();
      const inputMenuSpy = spy();

      selectionMenu = { popup: selectionMenuSpy };
      inputMenu = { popup: inputMenuSpy };
    });

    it('should pop up input menu when editable', () => {
      const props = { selectionText: '', isEditable: true };
      menuPopup({ props, selectionMenu, inputMenu, win });

      expect(inputMenu.popup).to.have.been.calledWith(win);
      expect(selectionMenu.popup).to.not.have.been.calledWith();
    });

    it('should pop up selection menu when not editable', () => {
      const props = { selectionText: 'some text', isEditable: false };
      menuPopup({ props, selectionMenu, inputMenu, win });

      expect(selectionMenu.popup).to.have.been.calledWith(win);
      expect(inputMenu.popup).to.not.have.been.calledWith();
    });
  });
});
