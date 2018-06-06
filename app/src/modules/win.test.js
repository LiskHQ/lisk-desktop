import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import win from './win';

describe('Electron Browser Window Wrapper', () => {
  const callbacks = {};
  const events = [];
  const path = { resolve: () => ('test') };
  const electronLocalshortcut = {
    register: () => {},
  };

  const electron = {
    screen: { getPrimaryDisplay: () => ({ workAreaSize: { width: 1400, height: 900 } }) },
    BrowserWindow: ({
      width, height, center, webPreferences,
    }) =>
      ({
        width,
        height,
        center,
        webPreferences,
        loadURL: spy(),
        on: (item, callback) => {
          callbacks[item] = callback;
        },
        webContents: {
          on: (item, callback) => {
            callbacks[item] = callback;
          },
          send: (event, value) => {
            events.push({ event, value });
          },
        },
      }),
    Menu: {
      setApplicationMenu: spy(),
      buildFromTemplate: () => (electron.Menu),
      popup: spy(),
    },
    app: { getName: () => ('Lisk Hub'), getVersion: () => ('some version') },
  };


  afterEach(() => {
    win.browser = null;
    win.isUILoaded = false;
    win.eventStack.length = 0;
    events.length = 0;
  });

  describe('Init', () => {
    it('Creates the window and sets webPreferences and other settings', () => {
      win.init({ electron, path, electronLocalshortcut });
      expect(win.browser.webPreferences.backgroundThrottling).to.equal(false);
      expect(win.browser.webPreferences.preload).to.equal('test');
      expect(win.browser.center).to.equal(true);
      expect(win.browser.devtools).to.equal(true);
      expect(win.browser.loadURL).to.have.been.calledWith(`file://${__dirname}/index.html`);
    });

    it('Creates the window of maximum size possible size on < 1680X1050 display', () => {
      win.init({ electron, path, electronLocalshortcut });
      expect(win.browser.height).to.equal(900);
      expect(win.browser.width).to.equal(1400);
    });

    it('Creates the window of maximum 1680X1050 on a bigger than that display', () => {
      electron.screen.getPrimaryDisplay = () => ({ workAreaSize: { width: 2001, height: 1051 } });
      win.init({ electron, path, electronLocalshortcut });
      expect(win.browser.height).to.equal(1050);
      expect(win.browser.width).to.equal(1680);
    });
  });

  describe('Sending events', () => {
    it('Saves events in event stack', () => {
      expect(win.eventStack.length).to.equal(0);
      win.send({ event: 'openUrl', value: 'someurl' });
      expect(win.browser).to.equal(null);
      expect(win.eventStack.length).to.equal(1);
    });

    it('Sends events', () => {
      win.init({ electron, path, electronLocalshortcut });
      win.isUILoaded = true;
      win.send({ event: 'openUrl', value: 'someurl' });
      expect(win.eventStack.length).to.equal(0);
    });
  });

  describe('Create', () => {
    const storage = {
      get: (item, callback) => {
        callbacks[item] = callback;
      },
    };

    it('Sends blur and focus events', () => {
      win.create({
        electron, path, electronLocalshortcut, storage,
      });
      expect(events.length).to.equal(0);
      callbacks.focus();
      expect(events[0].event).to.equal('focus');
      callbacks.blur();
      expect(events[1].event).to.equal('blur');
    });

    it('Creates the window with menu when platform is "darwin"', () => {
      process.platform = 'darwin';

      expect(win.browser).to.equal(null);
      win.create({
        electron, path, electronLocalshortcut, storage,
      });
      expect(win.browser).to.not.equal(null);

      // detect the locale
      callbacks.config(null, { lang: 'de' });
      expect(win.eventStack.length).to.equal(1);
      expect(win.eventStack[0].event).to.equal('detectedLocale');
      expect(win.eventStack[0].value).to.equal('de');

      // check the menu gets build
      // todo: think of a better way to test this? don't actually execute 'buildMenu'
      expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);

      // todo: think of a way to differentiate between 'inputMenu' and 'selectionMenu' in the test
      callbacks['context-menu'](null, { isEditable: true });
      expect(electron.Menu.popup).to.have.been.calledWith(win.browser);

      // fire finish load event
      expect(events.length).to.equal(0);
      callbacks['did-finish-load']();
      expect(win.eventStack.length).to.equal(0);
      expect(events.length).to.equal(1);
      expect(events[0].event).to.equal('detectedLocale');
      expect(events[0].value).to.equal('de');

      callbacks.closed();
      expect(win.browser).to.equal(null);
    });

    it('Creates the window with menu when platform is not "darwin"', () => {
      process.platform = 'not darwin';

      expect(win.browser).to.equal(null);
      win.create({
        electron, path, electronLocalshortcut, storage,
      });
      expect(win.browser).to.not.equal(null);

      // detect the locale
      callbacks.config(null, { lang: 'de' });
      expect(win.eventStack.length).to.equal(2);
      expect(win.eventStack[0].event).to.equal('openUrl');
      expect(win.eventStack[0].value).to.equal('/');
      expect(win.eventStack[1].event).to.equal('detectedLocale');
      expect(win.eventStack[1].value).to.equal('de');

      // check the menu gets build
      // todo: think of a better way to test this? don't actually execute 'buildMenu'
      expect(electron.Menu.setApplicationMenu).to.have.been.calledWith(electron.Menu);

      // todo: think of a way to differentiate between 'inputMenu' and 'selectionMenu' in the test
      callbacks['context-menu'](null, { selectionText: 'some text' });
      expect(electron.Menu.popup).to.have.been.calledWith(win.browser);

      // fire finish load event
      expect(events.length).to.equal(0);
      callbacks['did-finish-load']();
      expect(win.eventStack.length).to.equal(0);
      expect(events.length).to.equal(2);
      expect(events[0].event).to.equal('openUrl');
      expect(events[0].value).to.equal('/');
      expect(events[1].event).to.equal('detectedLocale');
      expect(events[1].value).to.equal('de');

      callbacks.closed();
      expect(win.browser).to.equal(null);
    });
  });
});
